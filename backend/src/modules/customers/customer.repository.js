const sql = require('mssql');

const getAll = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM KHACH_HANG');
    return result.recordset;
};

const getById = async (id) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM KHACH_HANG WHERE MaKhachHang = @id');
    return result.recordset[0];
};

const update = async (id, updateData) => {
    const pool = await sql.connect();
    // Giả định cập nhật các trường cơ bản như HoTen, SoDienThoai, Email
    await pool.request()
        .input('id', sql.Int, id)
        .input('hoTen', sql.NVarChar, updateData.hoTen)
        .input('soDienThoai', sql.VarChar, updateData.soDienThoai)
        .input('email', sql.VarChar, updateData.email)
        .query(`
            UPDATE KHACH_HANG 
            SET HoTen = ISNULL(@hoTen, HoTen),
                SoDienThoai = ISNULL(@soDienThoai, SoDienThoai),
                Email = ISNULL(@email, Email)
            WHERE MaKhachHang = @id
        `);
    return await getById(id);
};

const create = async (data) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('hoTen', sql.NVarChar, data.hoTen)
        .input('soDienThoai', sql.VarChar, data.soDienThoai)
        .input('email', sql.VarChar, data.email)
        .input('matKhau', sql.VarChar, data.matKhau)
        .query(`
            INSERT INTO KHACH_HANG (HoTen, SoDienThoai, Email, MatKhau)
            OUTPUT INSERTED.*
            VALUES (@hoTen, @soDienThoai, @email, @matKhau)
        `);
    return result.recordset[0];
};

module.exports = {
    getAll,
    getById,
    update,
    create
};