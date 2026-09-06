const { sql, getPool } = require('../../config/database');

class MovieRepository {
    async findAll({ page = 1, limit = 10, status, keyword }) {
        const pool = await getPool();
        const offset = (page - 1) * limit;

        let query = `
            SELECT MaPhim, TenPhim, TheLoai, ThoiLuong, TrangThaiPhim, 
                   NgayKhoiChieu, NgayKetThuc, MoTaPhim, DaoDien, DoTuoi
            FROM PHIM
            WHERE 1 = 1
        `;
        const request = pool.request();

        if (status) {
            query += ` AND TrangThaiPhim = @status`;
            request.input('status', sql.NVarChar(50), status);
        }

        if (keyword) {
            query += ` AND TenPhim LIKE @keyword`;
            request.input('keyword', sql.NVarChar(255), `%${keyword}%`);
        }

        query += ` ORDER BY MaPhim DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limit);

        const result = await request.query(query);
        return result.recordset;
    }

    async findById(id) {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT * FROM PHIM WHERE MaPhim = @id`);
        return result.recordset[0] || null;
    }

    async create(data) {
        const pool = await getPool();
        const result = await pool.request()
            .input('MaPhim', sql.Int, data.MaPhim)
            .input('TenPhim', sql.NVarChar(255), data.TenPhim)
            .input('TheLoai', sql.NVarChar(100), data.TheLoai)
            .input('ThoiLuong', sql.Int, data.ThoiLuong)
            .input('TrangThaiPhim', sql.NVarChar(50), data.TrangThaiPhim)
            .input('NgayKhoiChieu', sql.Date, data.NgayKhoiChieu)
            .input('NgayKetThuc', sql.Date, data.NgayKetThuc || null)
            .input('MoTaPhim', sql.NVarChar(sql.MAX), data.MoTaPhim || null)
            .input('DaoDien', sql.NVarChar(150), data.DaoDien || null)
            .input('DoTuoi', sql.Int, data.DoTuoi)
            .query(`
                INSERT INTO PHIM (MaPhim, TenPhim, TheLoai, ThoiLuong, TrangThaiPhim, NgayKhoiChieu, NgayKetThuc, MoTaPhim, DaoDien, DoTuoi)
                VALUES (@MaPhim, @TenPhim, @TheLoai, @ThoiLuong, @TrangThaiPhim, @NgayKhoiChieu, @NgayKetThuc, @MoTaPhim, @DaoDien, @DoTuoi);
                SELECT * FROM PHIM WHERE MaPhim = @MaPhim;
            `);
        return result.recordset[0];
    }

    async update(id, data) {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('TenPhim', sql.NVarChar(255), data.TenPhim)
            .input('TheLoai', sql.NVarChar(100), data.TheLoai)
            .input('ThoiLuong', sql.Int, data.ThoiLuong)
            .input('TrangThaiPhim', sql.NVarChar(50), data.TrangThaiPhim)
            .input('NgayKhoiChieu', sql.Date, data.NgayKhoiChieu)
            .input('NgayKetThuc', sql.Date, data.NgayKetThuc || null)
            .input('MoTaPhim', sql.NVarChar(sql.MAX), data.MoTaPhim || null)
            .input('DaoDien', sql.NVarChar(150), data.DaoDien || null)
            .input('DoTuoi', sql.Int, data.DoTuoi)
            .query(`
                UPDATE PHIM
                SET TenPhim = @TenPhim,
                    TheLoai = @TheLoai,
                    ThoiLuong = @ThoiLuong,
                    TrangThaiPhim = @TrangThaiPhim,
                    NgayKhoiChieu = @NgayKhoiChieu,
                    NgayKetThuc = @NgayKetThuc,
                    MoTaPhim = @MoTaPhim,
                    DaoDien = @DaoDien,
                    DoTuoi = @DoTuoi
                WHERE MaPhim = @id;
                SELECT * FROM PHIM WHERE MaPhim = @id;
            `);
        return result.recordset[0] || null;
    }

    async delete(id) {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM PHIM WHERE MaPhim = @id`);
        return result.rowsAffected[0] > 0;
    }
}

module.exports = new MovieRepository();