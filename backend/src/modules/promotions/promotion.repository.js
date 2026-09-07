const { getPool, sql } = require('../../config/database');

// Lấy tất cả khuyến mãi
const findAll = async () => {
    const pool = getPool();

    const result = await pool
        .request()
        .query(`
            SELECT
                MaKhuyenMai,
                TenKhuyenMai,
                PhanTramGiam,
                NgayBatDau,
                NgayKetThuc
            FROM KHUYEN_MAI
            ORDER BY MaKhuyenMai
        `);

    return result.recordset;
};

// Lấy khuyến mãi theo ID
const findById = async (promotionId) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('MaKhuyenMai', sql.Int, promotionId)
        .query(`
            SELECT
                MaKhuyenMai,
                TenKhuyenMai,
                PhanTramGiam,
                NgayBatDau,
                NgayKetThuc
            FROM KHUYEN_MAI
            WHERE MaKhuyenMai = @MaKhuyenMai
        `);

    return result.recordset[0] || null;
};

// Lấy các khuyến mãi đang còn hiệu lực
const findActive = async () => {
    const pool = getPool();

    const result = await pool
        .request()
        .query(`
            SELECT
                MaKhuyenMai,
                TenKhuyenMai,
                PhanTramGiam,
                NgayBatDau,
                NgayKetThuc
            FROM KHUYEN_MAI
            WHERE CAST(GETDATE() AS DATE)
                BETWEEN NgayBatDau AND NgayKetThuc
            ORDER BY NgayBatDau DESC
        `);

    return result.recordset;
};

// Tạo khuyến mãi
const create = async ({
    tenKhuyenMai,
    phanTramGiam,
    ngayBatDau,
    ngayKetThuc,
}) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input(
            'TenKhuyenMai',
            sql.NVarChar(150),
            tenKhuyenMai
        )
        .input(
            'PhanTramGiam',
            sql.Decimal(5, 2),
            phanTramGiam
        )
        .input(
            'NgayBatDau',
            sql.Date,
            ngayBatDau
        )
        .input(
            'NgayKetThuc',
            sql.Date,
            ngayKetThuc
        )
        .query(`
            DECLARE @NewMaKhuyenMai INT;

            SELECT
                @NewMaKhuyenMai =
                    ISNULL(MAX(MaKhuyenMai), 0) + 1
            FROM KHUYEN_MAI;

            INSERT INTO KHUYEN_MAI (
                MaKhuyenMai,
                TenKhuyenMai,
                PhanTramGiam,
                NgayBatDau,
                NgayKetThuc
            )
            OUTPUT
                INSERTED.MaKhuyenMai,
                INSERTED.TenKhuyenMai,
                INSERTED.PhanTramGiam,
                INSERTED.NgayBatDau,
                INSERTED.NgayKetThuc
            VALUES (
                @NewMaKhuyenMai,
                @TenKhuyenMai,
                @PhanTramGiam,
                @NgayBatDau,
                @NgayKetThuc
            );
        `);

    return result.recordset[0];
};

// Cập nhật khuyến mãi
const update = async (
    promotionId,
    {
        tenKhuyenMai,
        phanTramGiam,
        ngayBatDau,
        ngayKetThuc,
    }
) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input(
            'MaKhuyenMai',
            sql.Int,
            promotionId
        )
        .input(
            'TenKhuyenMai',
            sql.NVarChar(150),
            tenKhuyenMai
        )
        .input(
            'PhanTramGiam',
            sql.Decimal(5, 2),
            phanTramGiam
        )
        .input(
            'NgayBatDau',
            sql.Date,
            ngayBatDau
        )
        .input(
            'NgayKetThuc',
            sql.Date,
            ngayKetThuc
        )
        .query(`
            UPDATE KHUYEN_MAI
            SET
                TenKhuyenMai = @TenKhuyenMai,
                PhanTramGiam = @PhanTramGiam,
                NgayBatDau = @NgayBatDau,
                NgayKetThuc = @NgayKetThuc
            OUTPUT
                INSERTED.MaKhuyenMai,
                INSERTED.TenKhuyenMai,
                INSERTED.PhanTramGiam,
                INSERTED.NgayBatDau,
                INSERTED.NgayKetThuc
            WHERE MaKhuyenMai = @MaKhuyenMai
        `);

    return result.recordset[0] || null;
};

// Xóa khuyến mãi
const remove = async (promotionId) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input(
            'MaKhuyenMai',
            sql.Int,
            promotionId
        )
        .query(`
            DELETE FROM KHUYEN_MAI
            OUTPUT DELETED.MaKhuyenMai
            WHERE MaKhuyenMai = @MaKhuyenMai
        `);

    return result.recordset[0] || null;
};

module.exports = {
    findAll,
    findById,
    findActive,
    create,
    update,
    remove,
};