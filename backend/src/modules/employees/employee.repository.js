const sql = require('mssql');

const getAll = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM NHAN_VIEN');
    return result.recordset;
};

const getById = async (id) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM NHAN_VIEN WHERE MaNhanVien = @id');
    return result.recordset[0];
};

const create = async (data) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('hoTen', sql.NVarChar, data.hoTen)
        .input('soDienThoai', sql.VarChar, data.soDienThoai)
        .input('email', sql.VarChar, data.email)
        .input('matKhau', sql.VarChar, data.matKhau)
        .input('chucVu', sql.NVarChar, data.chucVu)
        .query(`
            INSERT INTO NHAN_VIEN (HoTen, SoDienThoai, Email, MatKhau, ChucVu)
            OUTPUT INSERTED.*
            VALUES (@hoTen, @soDienThoai, @email, @matKhau, @chucVu)
        `);
    return result.recordset[0];
};

const update = async (id, updateData) => {
    const pool = await sql.connect();
    await pool.request()
        .input('id', sql.Int, id)
        .input('hoTen', sql.NVarChar, updateData.hoTen)
        .input('soDienThoai', sql.VarChar, updateData.soDienThoai)
        .input('email', sql.VarChar, updateData.email)
        .input('chucVu', sql.NVarChar, updateData.chucVu)
        .query(`
            UPDATE NHAN_VIEN 
            SET HoTen = ISNULL(@hoTen, HoTen),
                SoDienThoai = ISNULL(@soDienThoai, SoDienThoai),
                Email = ISNULL(@email, Email),
                ChucVu = ISNULL(@chucVu, ChucVu)
            WHERE MaNhanVien = @id
        `);
    return await getById(id);
};

const remove = async (id) => {
    const pool = await sql.connect();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM NHAN_VIEN WHERE MaNhanVien = @id');
    return true;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};