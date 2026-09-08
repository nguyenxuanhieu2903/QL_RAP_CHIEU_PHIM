const { getConnection, sql } = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../utils/error');

class RoomsRepository {
    
    // Lấy danh sách phòng theo rạp
    async findByCinema(cinemaId, page = 1, limit = 10) {
        try {
            const pool = await getConnection();
            const offset = (page - 1) * limit;

            const cinemaCheck = await pool.request()
                .input('MaRap', sql.Int, cinemaId)
                .query(`SELECT MaRap FROM RAP WHERE MaRap = @MaRap`);
            
            if (cinemaCheck.recordset.length === 0) {
                throw new NotFoundError('Rạp không tồn tại');
            }

            const countResult = await pool.request()
                .input('MaRap', sql.Int, cinemaId)
                .query(`
                    SELECT COUNT(*) as total 
                    FROM PHONG_CHIEU 
                    WHERE MaRap = @MaRap
                `);
            // Lấy danh sách phòng (có JOIN với RAP để lấy tên rạp)
            const result = await pool.request()
                .input('MaRap', sql.Int, cinemaId)
                .input('offset', sql.Int, offset)
                .input('limit', sql.Int, limit)
                .query(`
                    SELECT 
                        p.MaPhong,
                        p.TenPhong,
                        p.TongSoGhe,   -- ← Đã sửa từ SoLuongGhe
                        p.MaRap,
                        r.TenRap
                    FROM PHONG_CHIEU p
                    INNER JOIN RAP r ON p.MaRap = r.MaRap
                    WHERE p.MaRap = @MaRap
                    ORDER BY p.TenPhong
                    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
                `);

            return {
                items: result.recordset,
                total: countResult.recordset[0]?.total || 0
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy tất cả phòng theo rạp
    async findAllByCinema(cinemaId) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('MaRap', sql.Int, cinemaId)
                .query(`
                    SELECT 
                        MaPhong,
                        TenPhong,
                        TongSoGhe 
                    FROM PHONG_CHIEU
                    WHERE MaRap = @MaRap
                    ORDER BY TenPhong
                `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết phòng
    async findById(id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('MaPhong', sql.Int, id)
                .query(`
                    SELECT 
                        p.MaPhong,
                        p.TenPhong,
                        p.TongSoGhe,   -- ← Đã sửa từ SoLuongGhe
                        p.MaRap,
                        r.TenRap
                    FROM PHONG_CHIEU p
                    INNER JOIN RAP r ON p.MaRap = r.MaRap
                    WHERE p.MaPhong = @MaPhong
                `);

            if (result.recordset.length === 0) {
                return null;
            }
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra tên phòng đã tồn tại
    // Mỗi rạp không được có 2 phòng trùng tên
    async existsByName(cinemaId, tenPhong, excludeId = null) {
        try {
            const pool = await getConnection();
            let query = `
                SELECT COUNT(*) as count 
                FROM PHONG_CHIEU 
                WHERE MaRap = @MaRap AND TenPhong = @tenPhong
            `;
            const request = pool.request()
                .input('MaRap', sql.Int, cinemaId)
                .input('tenPhong', sql.NVarChar, tenPhong);
            
            if (excludeId) {
                query += ` AND MaPhong != @excludeId`;
                request.input('excludeId', sql.Int, excludeId);
            }

            const result = await request.query(query);
            return result.recordset[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Tạo phòng mới
    async create(roomData) {
        try {
            const pool = await getConnection();
            
            const exists = await this.existsByName(roomData.MaRap, roomData.TenPhong);
            if (exists) {
                throw new ConflictError('Tên phòng đã tồn tại trong rạp này');
            }

            // Lấy Max MaPhong
            const maxResult = await pool.request()
                .query(`SELECT ISNULL(MAX(MaPhong), 0) + 1 as MaxId FROM PHONG_CHIEU`);
            const newId = maxResult.recordset[0].MaxId;

            await pool.request()
                .input('MaPhong', sql.Int, newId)
                .input('MaRap', sql.Int, roomData.MaRap)
                .input('TenPhong', sql.NVarChar, roomData.TenPhong)
                .input('TongSoGhe', sql.Int, roomData.TongSoGhe)  // ← Đã sửa
                .query(`
                    INSERT INTO PHONG_CHIEU (MaPhong, MaRap, TenPhong, TongSoGhe)
                    VALUES (@MaPhong, @MaRap, @TenPhong, @TongSoGhe)
                `);

            return await this.findById(newId);
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật phòng
    async update(id, roomData) {
        try {
            const pool = await getConnection();
            const updates = [];
            const request = pool.request().input('MaPhong', sql.Int, id);

            const existingRoom = await this.findById(id);
            if (!existingRoom) {
                throw new NotFoundError('Không tìm thấy phòng');
            }

            if (roomData.TenPhong !== undefined) {
                const exists = await this.existsByName(
                    roomData.MaRap || existingRoom.MaRap, 
                    roomData.TenPhong, 
                    id
                );
                if (exists) {
                    throw new ConflictError('Tên phòng đã tồn tại trong rạp này');
                }
                updates.push('TenPhong = @TenPhong');
                request.input('TenPhong', sql.NVarChar, roomData.TenPhong);
            }
            
            if (roomData.TongSoGhe !== undefined) {
                updates.push('TongSoGhe = @TongSoGhe');
                request.input('TongSoGhe', sql.Int, roomData.TongSoGhe);
            }

            if (updates.length === 0) {
                return await this.findById(id);
            }

            const query = `
                UPDATE PHONG_CHIEU
                SET ${updates.join(', ')}
                WHERE MaPhong = @MaPhong
            `;

            await request.query(query);
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Xóa phòng
    async delete(id) {
        try {
            const pool = await getConnection();
            
            const room = await this.findById(id);
            if (!room) {
                throw new NotFoundError('Không tìm thấy phòng');
            }

            // Kiểm tra phòng có ghế không
            const seatCheck = await pool.request()
                .input('MaPhong', sql.Int, id)
                .query(`
                    SELECT COUNT(*) as count 
                    FROM GHE 
                    WHERE MaPhong = @MaPhong
                `);

            if (seatCheck.recordset[0].count > 0) {
                throw new ConflictError('Phòng đang có ghế, không thể xóa');
            }

            await pool.request()
                .input('MaPhong', sql.Int, id)
                .query(`DELETE FROM PHONG_CHIEU WHERE MaPhong = @MaPhong`);

            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RoomsRepository();