const { getConnection, sql } = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../utils/error');

class CinemasRepository {
    // Lấy danh sách rạp với phân trang
    async findAll(page = 1, limit = 10, keyword = '') {
        try {
            const pool = await getConnection();
            const offset = (page - 1) * limit;

            let query = `
                SELECT 
                    MaRap,
                    TenRap,
                    DiaChi,
                    SDT,
                    Email,
                    TrangThai,
                    CreatedAt,
                    UpdatedAt
                FROM RAP
                WHERE TrangThai = 1
            `;

            const params = [];

            if (keyword) {
                query += ` AND (TenRap LIKE @keyword OR DiaChi LIKE @keyword)`;
                params.push({ name: 'keyword', value: `%${keyword}%`, type: sql.NVarChar });
            }

            // Lấy tổng số bản ghi
            const countQuery = query.replace(
                /SELECT .* FROM RAP/,
                'SELECT COUNT(*) as total FROM RAP'
            );
            
            const countResult = await pool.request();
            params.forEach(p => {
                countResult.input(p.name, p.type, p.value);
            });
            const total = await countResult.query(countQuery);

            // Lấy dữ liệu phân trang
            query += ` ORDER BY TenRap ASC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
            const dataResult = await pool.request();
            dataResult.input('offset', sql.Int, offset);
            dataResult.input('limit', sql.Int, limit);
            params.forEach(p => {
                if (p.name !== 'offset' && p.name !== 'limit') {
                    dataResult.input(p.name, p.type, p.value);
                }
            });

            const result = await dataResult.query(query);
            return {
                items: result.recordset,
                total: total.recordset[0]?.total || 0
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết rạp theo ID
    async findById(id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('MaRap', sql.Int, id)
                .query(`
                    SELECT 
                        MaRap,
                        TenRap,
                        DiaChi,
                        SDT,
                        Email,
                        TrangThai,
                        CreatedAt,
                        UpdatedAt
                    FROM RAP
                    WHERE MaRap = @MaRap
                `);

            if (result.recordset.length === 0) {
                return null;
            }
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra tên rạp đã tồn tại
    async existsByName(tenRap, excludeId = null) {
        try {
            const pool = await getConnection();
            let query = `SELECT COUNT(*) as count FROM RAP WHERE TenRap = @tenRap`;
            const request = pool.request().input('tenRap', sql.NVarChar, tenRap);
            
            if (excludeId) {
                query += ` AND MaRap != @excludeId`;
                request.input('excludeId', sql.Int, excludeId);
            }

            const result = await request.query(query);
            return result.recordset[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Tạo mới rạp
    async create(cinemaData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('TenRap', sql.NVarChar, cinemaData.tenRap)
                .input('DiaChi', sql.NVarChar, cinemaData.diaChi)
                .input('SDT', sql.NVarChar, cinemaData.sdt)
                .input('Email', sql.NVarChar, cinemaData.email || null)
                .input('TrangThai', sql.Bit, cinemaData.trangThai !== undefined ? cinemaData.trangThai : 1)
                .query(`
                    INSERT INTO RAP (TenRap, DiaChi, SDT, Email, TrangThai)
                    OUTPUT INSERTED.MaRap
                    VALUES (@TenRap, @DiaChi, @SDT, @Email, @TrangThai)
                `);

            const id = result.recordset[0].MaRap;
            return await this.findById(id);
        } catch (error) {
            if (error.message.includes('duplicate')) {
                throw new ConflictError('Tên rạp đã tồn tại');
            }
            throw error;
        }
    }

    // Cập nhật rạp
    async update(id, cinemaData) {
        try {
            const pool = await getConnection();
            const updates = [];
            const request = pool.request().input('MaRap', sql.Int, id);

            if (cinemaData.tenRap !== undefined) {
                updates.push('TenRap = @TenRap');
                request.input('TenRap', sql.NVarChar, cinemaData.tenRap);
            }
            if (cinemaData.diaChi !== undefined) {
                updates.push('DiaChi = @DiaChi');
                request.input('DiaChi', sql.NVarChar, cinemaData.diaChi);
            }
            if (cinemaData.sdt !== undefined) {
                updates.push('SDT = @SDT');
                request.input('SDT', sql.NVarChar, cinemaData.sdt);
            }
            if (cinemaData.email !== undefined) {
                updates.push('Email = @Email');
                request.input('Email', sql.NVarChar, cinemaData.email);
            }
            if (cinemaData.trangThai !== undefined) {
                updates.push('TrangThai = @TrangThai');
                request.input('TrangThai', sql.Bit, cinemaData.trangThai);
            }

            if (updates.length === 0) {
                return await this.findById(id);
            }

            const query = `
                UPDATE RAP
                SET ${updates.join(', ')}, UpdatedAt = GETDATE()
                WHERE MaRap = @MaRap
            `;

            await request.query(query);
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Xóa rạp (soft delete)
    async delete(id) {
        try {
            const pool = await getConnection();
            
            // Kiểm tra rạp có tồn tại không
            const cinema = await this.findById(id);
            if (!cinema) {
                throw new NotFoundError('Không tìm thấy rạp');
            }

            // Kiểm tra rạp có đang được sử dụng không
            const usageCheck = await pool.request()
                .input('MaRap', sql.Int, id)
                .query(`
                    SELECT COUNT(*) as count FROM PHONG WHERE MaRap = @MaRap AND TrangThai = 1
                `);

            if (usageCheck.recordset[0].count > 0) {
                throw new ConflictError('Rạp đang có phòng đang hoạt động, không thể xóa');
            }

            // Soft delete
            await pool.request()
                .input('MaRap', sql.Int, id)
                .query(`
                    UPDATE RAP
                    SET TrangThai = 0, UpdatedAt = GETDATE()
                    WHERE MaRap = @MaRap
                `);

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Lấy số lượng rạp
    async count(activeOnly = true) {
        try {
            const pool = await getConnection();
            const query = activeOnly 
                ? `SELECT COUNT(*) as total FROM RAP WHERE TrangThai = 1`
                : `SELECT COUNT(*) as total FROM RAP`;
            
            const result = await pool.request().query(query);
            return result.recordset[0].total;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CinemasRepository();