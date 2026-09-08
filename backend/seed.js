const sql = require('mssql');
require('dotenv').config();

async function runSeed() {
    try {
        await sql.connect({
            user: process.env.DB_USER || 'sa',
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER || 'localhost',
            database: process.env.DB_NAME || 'QL_RAP_CHIEU_PHIM',
            options: { encrypt: false, trustServerCertificate: true }
        });

        await sql.query(`
            IF NOT EXISTS (SELECT 1 FROM KHACH_HANG WHERE MaKhachHang = 1)
                INSERT INTO KHACH_HANG (MaKhachHang, HoTen, SoDienThoai, DiemTichLuy) VALUES (1, N'Nguyen Van A', '0901234567', 0);

            IF NOT EXISTS (SELECT 1 FROM DAT_VE WHERE MaDatVe = 1)
                INSERT INTO DAT_VE (MaDatVe, MaKhachHang, ThoiGianDat, TongTien, TrangThai) VALUES (1, 1, GETDATE(), 150000, N'Da Dat');
        `);

        console.log("✅ Đã thêm dữ liệu mẫu thành công!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Lỗi:", err.message);
        process.exit(1);
    }
}

runSeed();