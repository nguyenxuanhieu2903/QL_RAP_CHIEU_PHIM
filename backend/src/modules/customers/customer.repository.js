const sql = require('mssql');

const findAll = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM KHACH_HANG');
    return result.recordset;
};

const findById = async (id) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM KHACH_HANG WHERE MaKhachHang = @id');
    return result.recordset[0];
};

const update = async (id, customerData) => {
    const pool = await sql.connect();
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('hoTen', sql.NVarChar, customerData.hoTen);
    request.input('soDienThoai', sql.VarChar, customerData.soDienThoai);

    await request.query(`
        UPDATE KHACH_HANG 
        SET HoTen = ISNULL(@hoTen, HoTen), 
            SoDienThoai = ISNULL(@soDienThoai, SoDienThoai)
        WHERE MaKhachHang = @id
    `);
    
    return await findById(id);
};

module.exports = {
    findAll,
    findById,
    update
};