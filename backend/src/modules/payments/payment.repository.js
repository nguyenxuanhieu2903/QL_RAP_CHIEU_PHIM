const sql = require('mssql');

const findAll = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM THANH_TOAN');
    return result.recordset;
};

const create = async (paymentData) => {
    const pool = await sql.connect();
    const idResult = await pool.request().query('SELECT ISNULL(MAX(MaThanhToan), 0) + 1 AS NextId FROM THANH_TOAN');
    const nextId = idResult.recordset[0].NextId;

    const request = pool.request();
    request.input('maThanhToan', nextId);
    request.input('maDatVe', paymentData.maDatVe);
    request.input('soTien', paymentData.amount);
    request.input('phuongThuc', paymentData.method);
    request.input('trangThai', paymentData.trangThaiThanhToan);

    const result = await request.query(`
        INSERT INTO THANH_TOAN (MaThanhToan, MaDatVe, ThoiGianThanhToan, SoTien, PhuongThuc, TrangThaiThanhToan) 
        VALUES (@maThanhToan, @maDatVe, GETDATE(), @soTien, @phuongThuc, @trangThai);
        SELECT * FROM THANH_TOAN WHERE MaThanhToan = @maThanhToan;
    `);
    return result.recordset[0];
};

const findById = async (id) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM THANH_TOAN WHERE MaThanhToan = @id');
    return result.recordset[0];
};

const findByBookingId = async (bookingId) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('bookingId', sql.Int, bookingId)
        .query('SELECT * FROM THANH_TOAN WHERE MaDatVe = @bookingId');
    return result.recordset[0];
};

module.exports = {
    findAll,
    create,
    findById,
    findByBookingId
};