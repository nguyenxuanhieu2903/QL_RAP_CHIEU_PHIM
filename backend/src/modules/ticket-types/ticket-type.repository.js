const { getPool, sql } = require('../../config/database');

// Lấy tất cả loại vé
const findAll = async () => {
    const pool = getPool();

    const result = await pool
        .request()
        .query(`
            SELECT
                MaLoaiVe,
                TenLoaiVe,
                MoTaLoaiVe
            FROM LOAI_VE
            ORDER BY MaLoaiVe
        `);

    return result.recordset;
};

// Lấy loại vé theo ID
const findById = async (ticketTypeId) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('MaLoaiVe', sql.Int, ticketTypeId)
        .query(`
            SELECT
                MaLoaiVe,
                TenLoaiVe,
                MoTaLoaiVe
            FROM LOAI_VE
            WHERE MaLoaiVe = @MaLoaiVe
        `);

    return result.recordset[0] || null;
};

// Tạo loại vé mới
const create = async ({
    tenLoaiVe,
    moTaLoaiVe,
}) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('TenLoaiVe', sql.NVarChar(100), tenLoaiVe)
        .input('MoTaLoaiVe', sql.NVarChar(255), moTaLoaiVe || null)
        .query(`
            DECLARE @NewMaLoaiVe INT;

            SELECT
                @NewMaLoaiVe = ISNULL(MAX(MaLoaiVe), 0) + 1
            FROM LOAI_VE;

            INSERT INTO LOAI_VE (
                MaLoaiVe,
                TenLoaiVe,
                MoTaLoaiVe
            )
            OUTPUT
                INSERTED.MaLoaiVe,
                INSERTED.TenLoaiVe,
                INSERTED.MoTaLoaiVe
            VALUES (
                @NewMaLoaiVe,
                @TenLoaiVe,
                @MoTaLoaiVe
            );
        `);

    return result.recordset[0];
};

// Cập nhật loại vé
const update = async (
    ticketTypeId,
    {
        tenLoaiVe,
        moTaLoaiVe,
    }
) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('MaLoaiVe', sql.Int, ticketTypeId)
        .input('TenLoaiVe', sql.NVarChar(100), tenLoaiVe)
        .input('MoTaLoaiVe', sql.NVarChar(255), moTaLoaiVe || null)
        .query(`
            UPDATE LOAI_VE
            SET
                TenLoaiVe = @TenLoaiVe,
                MoTaLoaiVe = @MoTaLoaiVe
            OUTPUT
                INSERTED.MaLoaiVe,
                INSERTED.TenLoaiVe,
                INSERTED.MoTaLoaiVe
            WHERE MaLoaiVe = @MaLoaiVe
        `);

    return result.recordset[0] || null;
};

// Xóa loại vé
const remove = async (ticketTypeId) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('MaLoaiVe', sql.Int, ticketTypeId)
        .query(`
            DELETE FROM LOAI_VE
            OUTPUT
                DELETED.MaLoaiVe
            WHERE MaLoaiVe = @MaLoaiVe
        `);

    return result.recordset[0] || null;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};