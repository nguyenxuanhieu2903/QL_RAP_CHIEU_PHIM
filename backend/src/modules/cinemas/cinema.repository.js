const { getConnection, sql } = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../utils/error');

class CinemasRepository {
    
    // Lấy danh sách rạp 
    async findAll(page = 1, limit = 10, keyword = '') {
        try {
            const pool = await getConnection();  //Kết nối đến SQL Server
            const offset = (page - 1) * limit;

            let query = `
                SELECT 
                    MaRap,
                    TenRap,
                    DiaChi,
                    Hotline 
                FROM RAP
            `;

            const params = [];

            if (keyword) {
                query += ` WHERE (TenRap LIKE @keyword OR DiaChi LIKE @keyword)`;
                params.push({ name: 'keyword', value: `%${keyword}%`, type: sql.NVarChar });
            }

            const countQuery = query.replace(
                /SELECT .* FROM RAP/,
                'SELECT COUNT(*) as total FROM RAP'
            );
            
            const countResult = await pool.request();
            params.forEach(p => {
                countResult.input(p.name, p.type, p.value);
            });
            const total = await countResult.query(countQuery);

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

    // Lấy chi tiết rạp
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
                        Hotline
                    FROM RAP
                    WHERE MaRap = @MaRap
                `);
             // Nếu không có dữ liệu ->trả về null
            if (result.recordset.length === 0) {
                return null;
            }
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Tạo rạp mới
    async create(cinemaData) {
        try {
            const pool = await getConnection();
            
            // Kiểm tra tên trùng
            const check = await pool.request()
                .input('TenRap', sql.NVarChar, cinemaData.TenRap)
                .query(`SELECT COUNT(*) as count FROM RAP WHERE TenRap = @TenRap`);
            
            if (check.recordset[0].count > 0) {
                throw new ConflictError('Tên rạp đã tồn tại');
            }

            const result = await pool.request()
                .input('TenRap', sql.NVarChar, cinemaData.TenRap)
                .input('DiaChi', sql.NVarChar, cinemaData.DiaChi)
                .input('Hotline', sql.NVarChar, cinemaData.Hotline)  
                .query(`
                    INSERT INTO RAP (MaRap, TenRap, DiaChi, Hotline)
                    VALUES (
                        (SELECT ISNULL(MAX(MaRap), 0) + 1 FROM RAP),
                        @TenRap,
                        @DiaChi,
                        @Hotline
                    )
                `);

            // Lấy ID vừa tạo
            const idResult = await pool.request()
                .query(`SELECT MAX(MaRap) as MaRap FROM RAP`);
            
            return await this.findById(idResult.recordset[0].MaRap);
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật rạp
    async update(id, cinemaData) {
        try {
            const pool = await getConnection();
            const updates = [];
            const request = pool.request().input('MaRap', sql.Int, id);

            if (cinemaData.TenRap !== undefined) {
                updates.push('TenRap = @TenRap');
                request.input('TenRap', sql.NVarChar, cinemaData.TenRap);
            }
            if (cinemaData.DiaChi !== undefined) {
                updates.push('DiaChi = @DiaChi');
                request.input('DiaChi', sql.NVarChar, cinemaData.DiaChi);
            }
            if (cinemaData.Hotline !== undefined) {
                updates.push('Hotline = @Hotline');
                request.input('Hotline', sql.NVarChar, cinemaData.Hotline);
            }

            if (updates.length === 0) {
                return await this.findById(id);
            }

            const query = `
                UPDATE RAP
                SET ${updates.join(', ')}
                WHERE MaRap = @MaRap
            `;

            await request.query(query);
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Xóa rạp 
    async delete(id) {
        try {
            const pool = await getConnection();
            
            const cinema = await this.findById(id);
            if (!cinema) {
                throw new NotFoundError('Không tìm thấy rạp');
            }

            // Kiểm tra rạp có phòng không (không cho xóa nếu có phòng)
            const roomCheck = await pool.request()
                .input('MaRap', sql.Int, id)
                .query(`
                    SELECT COUNT(*) as count FROM PHONG_CHIEU WHERE MaRap = @MaRap
                `);

            if (roomCheck.recordset[0].count > 0) {
                throw new ConflictError('Rạp đang có phòng, không thể xóa');
            }

            await pool.request()
                .input('MaRap', sql.Int, id)
                .query(`DELETE FROM RAP WHERE MaRap = @MaRap`);

            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CinemasRepository();