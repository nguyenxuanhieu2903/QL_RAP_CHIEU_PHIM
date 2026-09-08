const sql = require('mssql');

const findAll = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM NHAN_VIEN');
    return result.recordset;
};

const findById = async (id) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM NHAN_VIEN WHERE MaNhanVien = @id');
    return result.recordset[0];
};

const create = async (data) => {
    const pool = await sql.connect();
    const idResult = await pool.request().query('SELECT ISNULL(MAX(MaNhanVien), 0) + 1 AS NextId FROM NHAN_VIEN');
    const nextId = idResult.recordset[0].NextId;

    let rapCheck = await pool.request().query('SELECT TOP 1 MaRap FROM RAP');
    let maRap = data.maRap;

    if (rapCheck.recordset.length === 0) {
        await pool.request().query("INSERT INTO RAP (MaRap, TenRap, DiaChi, Hotline) VALUES (1, N'Rạp Mặc Định', N'Hồ Chí Minh', '0123456789')");
        maRap = 1;
    } else if (!maRap) {
        maRap = rapCheck.recordset[0].MaRap;
    }

    const request = pool.request();
    request.input('id', sql.Int, nextId);
    request.input('hoTen', sql.NVarChar, data.hoTen);
    request.input('soDienThoai', sql.VarChar, data.soDienThoai);
    request.input('chucVu', sql.NVarChar, data.chucVu);
    request.input('trangThai', sql.NVarChar, data.trangThaiNhanVien || 'Đang làm việc');
    request.input('maRap', sql.Int, maRap);

    const result = await request.query(`
        INSERT INTO NHAN_VIEN (MaNhanVien, HoTen, SoDienThoai, ChucVu, TrangThaiNhanVien, MaRap, NgayVaoLam) 
        VALUES (@id, @hoTen, @soDienThoai, @chucVu, @trangThai, @maRap, GETDATE());
        SELECT * FROM NHAN_VIEN WHERE MaNhanVien = @id;
    `);
    return result.recordset[0];
};

const update = async (id, data) => {
    const pool = await sql.connect();
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('hoTen', sql.NVarChar, data.hoTen);
    request.input('soDienThoai', sql.VarChar, data.soDienThoai);
    request.input('chucVu', sql.NVarChar, data.chucVu);

    await request.query(`
        UPDATE NHAN_VIEN 
        SET HoTen = ISNULL(@hoTen, HoTen), 
            SoDienThoai = ISNULL(@soDienThoai, SoDienThoai),
            ChucVu = ISNULL(@chucVu, ChucVu)
        WHERE MaNhanVien = @id
    `);
    return await findById(id);
};

const remove = async (id) => {
    const pool = await sql.connect();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM NHAN_VIEN WHERE MaNhanVien = @id');
    return { message: "Deleted successfully" };
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};