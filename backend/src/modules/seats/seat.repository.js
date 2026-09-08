const { getConnection, sql } = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../utils/error');

class SeatsRepository {

    // 1. Lấy danh sách ghế theo phòng (có phân trang)
    async findByRoom(roomId, page = 1, limit = 20) {
        try {
            const pool = await getConnection();
            const offset = (page - 1) * limit;

            // Kiểm tra phòng tồn tại
            const roomCheck = await pool.request()
                .input('MaPhong', sql.Int, roomId)
                .query(`SELECT MaPhong FROM PHONG_CHIEU WHERE MaPhong = @MaPhong`);

            if (roomCheck.recordset.length === 0) {
                throw new NotFoundError('Phòng không tồn tại');
            }

            // Đếm tổng số ghế
            const countResult = await pool.request()
                .input('MaPhong', sql.Int, roomId)
                .query(`
                    SELECT COUNT(*) as total 
                    FROM GHE 
                    WHERE MaPhong = @MaPhong
                `);

            // Lấy danh sách ghế
            const result = await pool.request()
                .input('MaPhong', sql.Int, roomId)
                .input('offset', sql.Int, offset)
                .input('limit', sql.Int, limit)
                .query(`
                    SELECT 
                        g.MaGhe,
                        g.SoGhe,
                        g.HangGhe,
                        g.TrangThaiVatLy,
                        g.MaPhong,
                        g.MaLoaiGhe,
                        l.TenLoaiGhe,
                        l.PhuThu,
                        l.MoTaLoaiGhe
                    FROM GHE g
                    INNER JOIN LOAI_GHE l ON g.MaLoaiGhe = l.MaLoaiGhe
                    WHERE g.MaPhong = @MaPhong
                    ORDER BY g.HangGhe, g.SoGhe
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

    // 2. Lấy tất cả ghế theo phòng (không phân trang)
    async findAllByRoom(roomId) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('MaPhong', sql.Int, roomId)
                .query(`
                    SELECT 
                        g.MaGhe,
                        g.SoGhe,
                        g.HangGhe,
                        g.TrangThaiVatLy,
                        g.MaLoaiGhe,
                        l.TenLoaiGhe,
                        l.PhuThu
                    FROM GHE g
                    INNER JOIN LOAI_GHE l ON g.MaLoaiGhe = l.MaLoaiGhe
                    WHERE g.MaPhong = @MaPhong
                    ORDER BY g.HangGhe, g.SoGhe
                `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // 3. Lấy chi tiết ghế theo ID
    async findById(id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('MaGhe', sql.Int, id)
                .query(`
                    SELECT 
                        g.MaGhe,
                        g.SoGhe,
                        g.HangGhe,
                        g.TrangThaiVatLy,
                        g.MaPhong,
                        g.MaLoaiGhe,
                        l.TenLoaiGhe,
                        l.PhuThu,
                        l.MoTaLoaiGhe
                    FROM GHE g
                    INNER JOIN LOAI_GHE l ON g.MaLoaiGhe = l.MaLoaiGhe
                    WHERE g.MaGhe = @MaGhe
                `);

            if (result.recordset.length === 0) {
                return null;
            }
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // 4. Kiểm tra ghế trùng vị trí (cùng hàng + cùng số)
    async existsByPosition(roomId, hangGhe, soGhe, excludeId = null) {
        try {
            const pool = await getConnection();
            let query = `
                SELECT COUNT(*) as count 
                FROM GHE 
                WHERE MaPhong = @MaPhong 
                  AND HangGhe = @hangGhe 
                  AND SoGhe = @soGhe
            `;
            const request = pool.request()
                .input('MaPhong', sql.Int, roomId)
                .input('hangGhe', sql.NVarChar, hangGhe)
                .input('soGhe', sql.Int, soGhe);

            if (excludeId) {
                query += ` AND MaGhe != @excludeId`;
                request.input('excludeId', sql.Int, excludeId);
            }

            const result = await request.query(query);
            return result.recordset[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // 5. Kiểm tra loại ghế có tồn tại không
    async checkLoaiGheExists(maLoaiGhe) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('MaLoaiGhe', sql.Int, maLoaiGhe)
                .query(`SELECT MaLoaiGhe FROM LOAI_GHE WHERE MaLoaiGhe = @MaLoaiGhe`);

            return result.recordset.length > 0;
        } catch (error) {
            throw error;
        }
    }

    // 6. Tạo ghế mới
    async create(seatData) {
        try {
            const pool = await getConnection();

            // Kiểm tra phòng tồn tại
            const roomCheck = await pool.request()
                .input('MaPhong', sql.Int, seatData.MaPhong)
                .query(`SELECT MaPhong FROM PHONG_CHIEU WHERE MaPhong = @MaPhong`);

            if (roomCheck.recordset.length === 0) {
                throw new NotFoundError('Phòng không tồn tại');
            }

            // Kiểm tra loại ghế tồn tại
            const loaiGheExists = await this.checkLoaiGheExists(seatData.MaLoaiGhe);
            if (!loaiGheExists) {
                throw new NotFoundError('Loại ghế không tồn tại');
            }

            // Kiểm tra trùng vị trí
            const exists = await this.existsByPosition(
                seatData.MaPhong,
                seatData.HangGhe,
                seatData.SoGhe
            );
            if (exists) {
                throw new ConflictError(`Ghế ${seatData.HangGhe}${seatData.SoGhe} đã tồn tại trong phòng này`);
            }

            // Lấy MaGhe max + 1 (vì không dùng IDENTITY)
            const maxResult = await pool.request()
                .query(`SELECT ISNULL(MAX(MaGhe), 0) + 1 as MaxId FROM GHE`);
            const newId = maxResult.recordset[0].MaxId;

            // Insert ghế mới
            await pool.request()
                .input('MaGhe', sql.Int, newId)
                .input('MaPhong', sql.Int, seatData.MaPhong)
                .input('MaLoaiGhe', sql.Int, seatData.MaLoaiGhe)
                .input('SoGhe', sql.Int, seatData.SoGhe)
                .input('HangGhe', sql.NVarChar, seatData.HangGhe)
                .input('TrangThaiVatLy', sql.NVarChar, seatData.TrangThaiVatLy || 'HoatDong')
                .query(`
                    INSERT INTO GHE (MaGhe, MaPhong, MaLoaiGhe, SoGhe, HangGhe, TrangThaiVatLy)
                    VALUES (@MaGhe, @MaPhong, @MaLoaiGhe, @SoGhe, @HangGhe, @TrangThaiVatLy)
                `);

            return await this.findById(newId);
        } catch (error) {
            throw error;
        }
    }
    // 7. Cập nhật ghế
    async update(id, seatData) {
        try {
            const pool = await getConnection();
            const updates = [];
            const request = pool.request().input('MaGhe', sql.Int, id);

            // Kiểm tra ghế tồn tại
            const existingSeat = await this.findById(id);
            if (!existingSeat) {
                throw new NotFoundError('Không tìm thấy ghế');
            }

            // Kiểm tra loại ghế nếu có update
            if (seatData.MaLoaiGhe !== undefined) {
                const loaiGheExists = await this.checkLoaiGheExists(seatData.MaLoaiGhe);
                if (!loaiGheExists) {
                    throw new NotFoundError('Loại ghế không tồn tại');
                }
                updates.push('MaLoaiGhe = @MaLoaiGhe');
                request.input('MaLoaiGhe', sql.Int, seatData.MaLoaiGhe);
            }

            // Kiểm tra trùng vị trí nếu update SoGhe hoặc HangGhe
            const newHangGhe = seatData.HangGhe !== undefined ? seatData.HangGhe : existingSeat.HangGhe;
            const newSoGhe = seatData.SoGhe !== undefined ? seatData.SoGhe : existingSeat.SoGhe;

            if (seatData.HangGhe !== undefined || seatData.SoGhe !== undefined) {
                const exists = await this.existsByPosition(
                    existingSeat.MaPhong,
                    newHangGhe,
                    newSoGhe,
                    id
                );
                if (exists) {
                    throw new ConflictError(`Ghế ${newHangGhe}${newSoGhe} đã tồn tại trong phòng này`);
                }
            }

            if (seatData.SoGhe !== undefined) {
                updates.push('SoGhe = @SoGhe');
                request.input('SoGhe', sql.Int, seatData.SoGhe);
            }

            if (seatData.HangGhe !== undefined) {
                updates.push('HangGhe = @HangGhe');
                request.input('HangGhe', sql.NVarChar, seatData.HangGhe);
            }

            if (seatData.TrangThaiVatLy !== undefined) {
                updates.push('TrangThaiVatLy = @TrangThaiVatLy');
                request.input('TrangThaiVatLy', sql.NVarChar, seatData.TrangThaiVatLy);
            }

            if (updates.length === 0) {
                return await this.findById(id);
            }

            const query = `
                UPDATE GHE
                SET ${updates.join(', ')}
                WHERE MaGhe = @MaGhe
            `;

            await request.query(query);
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // 8. Xóa ghế (chỉ xóa được nếu chưa được đặt)
    async delete(id) {
        try {
            const pool = await getConnection();

            // Kiểm tra ghế tồn tại
            const seat = await this.findById(id);
            if (!seat) {
                throw new NotFoundError('Không tìm thấy ghế');
            }

            // Kiểm tra ghế đã được đặt trong suất chiếu chưa
            const bookingCheck = await pool.request()
                .input('MaGhe', sql.Int, id)
                .query(`
                    SELECT COUNT(*) as count 
                    FROM GHE_SUATCHIEU 
                    WHERE MaGhe = @MaGhe
                `);

            if (bookingCheck.recordset[0].count > 0) {
                throw new ConflictError('Ghế đang được sử dụng trong suất chiếu, không thể xóa');
            }

            // Xóa ghế (hard delete)
            await pool.request()
                .input('MaGhe', sql.Int, id)
                .query(`DELETE FROM GHE WHERE MaGhe = @MaGhe`);

            return true;
        } catch (error) {
            throw error;
        }
    }
    // 9. Đếm số lượng ghế theo phòng
    async countByRoom(roomId, activeOnly = true) {
        try {
            const pool = await getConnection();
            let query = `
                SELECT COUNT(*) as total 
                FROM GHE 
                WHERE MaPhong = @MaPhong
            `;
            if (activeOnly) {
                query += ` AND TrangThaiVatLy = 'HoatDong'`;
            }

            const result = await pool.request()
                .input('MaPhong', sql.Int, roomId)
                .query(query);

            return result.recordset[0].total;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SeatsRepository();