const { getPool, sql } = require('../../config/database');

const findAccountByUsername = async (username) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('TenDangNhap', sql.VarChar, username)
        .query(`
            SELECT
                TK.MaTaiKhoan,
                TK.TenDangNhap,
                TK.MatKhauHash,
                COALESCE(KH.Email, NV.Email) AS Email,
                TK.MaRole,
                TK.MaKhachHang,
                TK.MaNhanVien,
                TK.TrangThaiTaiKhoan,
                R.TenRole
            FROM TAI_KHOAN TK
            INNER JOIN ROLE R
                ON TK.MaRole = R.MaRole
            LEFT JOIN KHACH_HANG KH
                ON TK.MaKhachHang = KH.MaKhachHang
            LEFT JOIN NHAN_VIEN NV
                ON TK.MaNhanVien = NV.MaNhanVien
            WHERE TK.TenDangNhap = @TenDangNhap
        `);

    return result.recordset[0] || null;
};

const findAccountById = async (userId) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('MaTaiKhoan', sql.Int, userId)
        .query(`
            SELECT
                TK.MaTaiKhoan,
                TK.TenDangNhap,
                COALESCE(KH.Email, NV.Email) AS Email,
                TK.MaRole,
                TK.MaKhachHang,
                TK.MaNhanVien,
                TK.TrangThaiTaiKhoan,
                R.TenRole
            FROM TAI_KHOAN TK
            INNER JOIN ROLE R
                ON TK.MaRole = R.MaRole
            LEFT JOIN KHACH_HANG KH
                ON TK.MaKhachHang = KH.MaKhachHang
            LEFT JOIN NHAN_VIEN NV
                ON TK.MaNhanVien = NV.MaNhanVien
            WHERE TK.MaTaiKhoan = @MaTaiKhoan
        `);

    return result.recordset[0] || null;
};

const findCustomerByEmail = async (email) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('Email', sql.VarChar, email)
        .query(`
            SELECT MaKhachHang
            FROM KHACH_HANG
            WHERE Email = @Email
        `);

    return result.recordset[0] || null;
};

const createCustomer = async ({
    fullName,
    phone,
    email,
}) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('HoTen', sql.NVarChar, fullName)
        .input('SoDienThoai', sql.VarChar, phone)
        .input('Email', sql.VarChar, email)
        .query(`
            INSERT INTO KHACH_HANG (
                HoTen,
                SoDienThoai,
                Email,
                DiemTichLuy
            )
            OUTPUT INSERTED.MaKhachHang
            VALUES (
                @HoTen,
                @SoDienThoai,
                @Email,
                0
            )
        `);

    return result.recordset[0].MaKhachHang;
};

const createAccount = async ({
    username,
    passwordHash,
    roleId,
    customerId,
}) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input('TenDangNhap', sql.VarChar, username)
        .input('MatKhauHash', sql.VarChar, passwordHash)
        .input('MaRole', sql.Int, roleId)
        .input('MaKhachHang', sql.Int, customerId)
        .query(`
            INSERT INTO TAI_KHOAN (
                TenDangNhap,
                MatKhauHash,
                MaRole,
                MaKhachHang,
                TrangThaiTaiKhoan,
                NgayTao
            )
            OUTPUT INSERTED.MaTaiKhoan
            VALUES (
                @TenDangNhap,
                @MatKhauHash,
                @MaRole,
                @MaKhachHang,
                N'ACTIVE',
                GETDATE()
            )
        `);

    return result.recordset[0].MaTaiKhoan;
};

module.exports = {
    findAccountByUsername,
    findAccountById,
    findCustomerByEmail,
    createCustomer,
    createAccount,
};