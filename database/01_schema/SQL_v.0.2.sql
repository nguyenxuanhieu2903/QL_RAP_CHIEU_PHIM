/* =====================================================
   DATABASE: QUAN LY RAP CHIEU PHIM
   BASELINE v0.2
   SQL SERVER

   STATUS:
   17 TABLES
   19 RELATIONSHIPS
   ===================================================== */


-- =====================================================
-- 0. DATABASE
-- =====================================================

IF DB_ID(N'QL_RAP_CHIEU_PHIM') IS NULL
BEGIN
    CREATE DATABASE QL_RAP_CHIEU_PHIM;
END
GO

USE QL_RAP_CHIEU_PHIM;
GO


/* =====================================================
   1. RAP
   ===================================================== */

CREATE TABLE RAP
(
    MaRap INT NOT NULL,
    TenRap NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255) NOT NULL,
    Hotline VARCHAR(20) NOT NULL,

    CONSTRAINT PK_RAP
        PRIMARY KEY (MaRap)
);
GO


/* =====================================================
   2. PHONG_CHIEU
   ===================================================== */

CREATE TABLE PHONG_CHIEU
(
    MaPhong INT NOT NULL,
    MaRap INT NOT NULL,
    TenPhong NVARCHAR(100) NOT NULL,
    TongSoGhe INT NOT NULL,

    CONSTRAINT PK_PHONG_CHIEU
        PRIMARY KEY (MaPhong),

    CONSTRAINT FK_PHONG_CHIEU_RAP
        FOREIGN KEY (MaRap)
        REFERENCES RAP(MaRap)
);
GO

CREATE INDEX IX_PHONG_CHIEU_MaRap
ON PHONG_CHIEU(MaRap);
GO


/* =====================================================
   3. LOAI_GHE
   ===================================================== */

CREATE TABLE LOAI_GHE
(
    MaLoaiGhe INT NOT NULL,
    TenLoaiGhe NVARCHAR(50) NOT NULL,
    MoTaLoaiGhe NVARCHAR(255) NULL,
    PhuThu DECIMAL(18,2) NOT NULL,

    CONSTRAINT PK_LOAI_GHE
        PRIMARY KEY (MaLoaiGhe)
);
GO


/* =====================================================
   4. GHE
   ===================================================== */

CREATE TABLE GHE
(
    MaGhe INT NOT NULL,
    MaPhong INT NOT NULL,
    MaLoaiGhe INT NOT NULL,
    SoGhe INT NOT NULL,
    HangGhe NVARCHAR(10) NOT NULL,
    TrangThaiVatLy NVARCHAR(50) NOT NULL,

    CONSTRAINT PK_GHE
        PRIMARY KEY (MaGhe),

    CONSTRAINT FK_GHE_PHONG_CHIEU
        FOREIGN KEY (MaPhong)
        REFERENCES PHONG_CHIEU(MaPhong),

    CONSTRAINT FK_GHE_LOAI_GHE
        FOREIGN KEY (MaLoaiGhe)
        REFERENCES LOAI_GHE(MaLoaiGhe)
);
GO

CREATE INDEX IX_GHE_MaPhong
ON GHE(MaPhong);
GO

CREATE INDEX IX_GHE_MaLoaiGhe
ON GHE(MaLoaiGhe);
GO


/* =====================================================
   5. PHIM
   ===================================================== */

CREATE TABLE PHIM
(
    MaPhim INT NOT NULL,
    TenPhim NVARCHAR(255) NOT NULL,
    TheLoai NVARCHAR(100) NOT NULL,
    ThoiLuong INT NOT NULL,
    TrangThaiPhim NVARCHAR(50) NOT NULL,
    NgayKhoiChieu DATE NOT NULL,
    NgayKetThuc DATE NULL,
    MoTaPhim NVARCHAR(MAX) NULL,
    DaoDien NVARCHAR(150) NULL,
    DoTuoi INT NOT NULL,

    CONSTRAINT PK_PHIM
        PRIMARY KEY (MaPhim)
);
GO


/* =====================================================
   6. SUAT_CHIEU
   ===================================================== */

CREATE TABLE SUAT_CHIEU
(
    MaSuatChieu INT NOT NULL,
    MaPhim INT NOT NULL,
    MaPhong INT NOT NULL,
    NgayChieu DATE NOT NULL,
    GioBatDau TIME NOT NULL,
    GioKetThuc TIME NOT NULL,
    TrangThaiSuatChieu NVARCHAR(50) NOT NULL,

    CONSTRAINT PK_SUAT_CHIEU
        PRIMARY KEY (MaSuatChieu),

    CONSTRAINT FK_SUAT_CHIEU_PHIM
        FOREIGN KEY (MaPhim)
        REFERENCES PHIM(MaPhim),

    CONSTRAINT FK_SUAT_CHIEU_PHONG
        FOREIGN KEY (MaPhong)
        REFERENCES PHONG_CHIEU(MaPhong)
);
GO

CREATE INDEX IX_SUAT_CHIEU_MaPhim
ON SUAT_CHIEU(MaPhim);
GO

CREATE INDEX IX_SUAT_CHIEU_MaPhong
ON SUAT_CHIEU(MaPhong);
GO


/* =====================================================
   7. GHE_SUATCHIEU
   ===================================================== */

CREATE TABLE GHE_SUATCHIEU
(
    MaSuatChieu INT NOT NULL,
    MaGhe INT NOT NULL,
    TrangThaiDat NVARCHAR(50) NOT NULL,

    CONSTRAINT PK_GHE_SUATCHIEU
        PRIMARY KEY (MaSuatChieu, MaGhe),

    CONSTRAINT FK_GHE_SUATCHIEU_SUAT_CHIEU
        FOREIGN KEY (MaSuatChieu)
        REFERENCES SUAT_CHIEU(MaSuatChieu),

    CONSTRAINT FK_GHE_SUATCHIEU_GHE
        FOREIGN KEY (MaGhe)
        REFERENCES GHE(MaGhe)
);
GO


/* =====================================================
   8. KHACH_HANG
   ===================================================== */

CREATE TABLE KHACH_HANG
(
    MaKhachHang INT NOT NULL,
    HoTen NVARCHAR(150) NOT NULL,
    SoDienThoai VARCHAR(20) NOT NULL,
    Email VARCHAR(150) NULL,
    DiemTichLuy INT NOT NULL,

    CONSTRAINT PK_KHACH_HANG
        PRIMARY KEY (MaKhachHang)
);
GO


/* =====================================================
   9. LOAI_VE
   ===================================================== */

CREATE TABLE LOAI_VE
(
    MaLoaiVe INT NOT NULL,
    TenLoaiVe NVARCHAR(100) NOT NULL,
    MoTaLoaiVe NVARCHAR(255) NULL,

    CONSTRAINT PK_LOAI_VE
        PRIMARY KEY (MaLoaiVe)
);
GO


/* =====================================================
   10. GIA_VE
   ===================================================== */

CREATE TABLE GIA_VE
(
    MaGiaVe INT NOT NULL,
    MaLoaiVe INT NOT NULL,
    GiaVeCoBan DECIMAL(18,2) NOT NULL,
    NgayApDung DATE NOT NULL,
	NgayKetThuc DATE NOT NULL,

    CONSTRAINT PK_GIA_VE
        PRIMARY KEY (MaGiaVe),

    CONSTRAINT FK_GIA_VE_LOAI_VE
        FOREIGN KEY (MaLoaiVe)
        REFERENCES LOAI_VE(MaLoaiVe)
);
GO

CREATE INDEX IX_GIA_VE_MaLoaiVe
ON GIA_VE(MaLoaiVe);
GO


/* =====================================================
   11. KHUYEN_MAI
   ===================================================== */

CREATE TABLE KHUYEN_MAI
(
    MaKhuyenMai INT NOT NULL,
    TenKhuyenMai NVARCHAR(150) NOT NULL,
    PhanTramGiam DECIMAL(5,2) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,

    CONSTRAINT PK_KHUYEN_MAI
        PRIMARY KEY (MaKhuyenMai)
);
GO


/* =====================================================
   12. NHAN_VIEN
   ===================================================== */

CREATE TABLE NHAN_VIEN
(
    MaNhanVien INT NOT NULL,
    MaRap INT NOT NULL,
    HoTen NVARCHAR(150) NOT NULL,
    NgaySinh DATE NULL,
    GioiTinh NVARCHAR(10) NULL,
    SoDienThoai VARCHAR(20) NOT NULL,
    Email VARCHAR(150) NULL,
    ChucVu NVARCHAR(100) NOT NULL,
    NgayVaoLam DATE NOT NULL,
    TrangThaiNhanVien NVARCHAR(50) NOT NULL,

    CONSTRAINT PK_NHAN_VIEN
        PRIMARY KEY (MaNhanVien),

    CONSTRAINT FK_NHAN_VIEN_RAP
        FOREIGN KEY (MaRap)
        REFERENCES RAP(MaRap)
);
GO

CREATE INDEX IX_NHAN_VIEN_MaRap
ON NHAN_VIEN(MaRap);
GO


/* =====================================================
   13. DAT_VE
   ===================================================== */

CREATE TABLE DAT_VE
(
    MaDatVe INT NOT NULL,
    MaKhachHang INT NOT NULL,
    MaKhuyenMai INT NULL,
    MaNhanVien INT NULL,

    ThoiGianDat DATETIME NOT NULL,
    TongTien DECIMAL(18,2) NOT NULL,
    TrangThai NVARCHAR(50) NOT NULL,

    CONSTRAINT PK_DAT_VE
        PRIMARY KEY (MaDatVe),

    CONSTRAINT FK_DAT_VE_KHACH_HANG
        FOREIGN KEY (MaKhachHang)
        REFERENCES KHACH_HANG(MaKhachHang),

    CONSTRAINT FK_DAT_VE_KHUYEN_MAI
        FOREIGN KEY (MaKhuyenMai)
        REFERENCES KHUYEN_MAI(MaKhuyenMai),

    CONSTRAINT FK_DAT_VE_NHAN_VIEN
        FOREIGN KEY (MaNhanVien)
        REFERENCES NHAN_VIEN(MaNhanVien)
);
GO

CREATE INDEX IX_DAT_VE_MaKhachHang
ON DAT_VE(MaKhachHang);
GO

CREATE INDEX IX_DAT_VE_MaKhuyenMai
ON DAT_VE(MaKhuyenMai);
GO

CREATE INDEX IX_DAT_VE_MaNhanVien
ON DAT_VE(MaNhanVien);
GO


/* =====================================================
   14. CHI_TIET_DAT_VE
   ===================================================== */

CREATE TABLE CHI_TIET_DAT_VE
(
    MaChiTiet INT NOT NULL,
    MaDatVe INT NOT NULL,
    MaSuatChieu INT NOT NULL,
    MaGhe INT NOT NULL,
    MaLoaiVe INT NOT NULL,
    GiaTaiThoiDiemDat DECIMAL(18,2) NOT NULL,

    CONSTRAINT PK_CHI_TIET_DAT_VE
        PRIMARY KEY (MaChiTiet),

    CONSTRAINT FK_CTDV_DAT_VE
        FOREIGN KEY (MaDatVe)
        REFERENCES DAT_VE(MaDatVe),

    CONSTRAINT FK_CTDV_GHE_SUAT
        FOREIGN KEY (MaSuatChieu, MaGhe)
        REFERENCES GHE_SUATCHIEU(MaSuatChieu, MaGhe),

    CONSTRAINT FK_CTDV_LOAI_VE
        FOREIGN KEY (MaLoaiVe)
        REFERENCES LOAI_VE(MaLoaiVe)
);
GO

CREATE INDEX IX_CTDV_MaDatVe
ON CHI_TIET_DAT_VE(MaDatVe);
GO

CREATE INDEX IX_CTDV_MaSuatChieu_MaGhe
ON CHI_TIET_DAT_VE(MaSuatChieu, MaGhe);
GO

CREATE INDEX IX_CTDV_MaLoaiVe
ON CHI_TIET_DAT_VE(MaLoaiVe);
GO


/* =====================================================
   15. THANH_TOAN
   ===================================================== */

CREATE TABLE THANH_TOAN
(
    MaThanhToan INT NOT NULL,
    MaDatVe INT NOT NULL,
    ThoiGianThanhToan DATETIME NULL,
    SoTien DECIMAL(18,2) NOT NULL,
    PhuongThuc NVARCHAR(50) NOT NULL,
    TrangThaiThanhToan NVARCHAR(50) NOT NULL,
    MaGiaoDich VARCHAR(100) NULL,

    CONSTRAINT PK_THANH_TOAN
        PRIMARY KEY (MaThanhToan),

    CONSTRAINT FK_THANH_TOAN_DAT_VE
        FOREIGN KEY (MaDatVe)
        REFERENCES DAT_VE(MaDatVe)
);
GO

CREATE INDEX IX_THANH_TOAN_MaDatVe
ON THANH_TOAN(MaDatVe);
GO


/* =====================================================
   16. ROLE
   AUTHENTICATION
   ===================================================== */

CREATE TABLE ROLE
(
    MaRole INT NOT NULL,
    TenRole VARCHAR(50) NOT NULL,
    MoTaRole NVARCHAR(255) NULL,

    CONSTRAINT PK_ROLE
        PRIMARY KEY (MaRole),

    CONSTRAINT UQ_ROLE_TenRole
        UNIQUE (TenRole)
);
GO


/* =====================================================
   17. TAI_KHOAN
   AUTHENTICATION
   ===================================================== */

CREATE TABLE TAI_KHOAN
(
    MaTaiKhoan INT NOT NULL,

    MaRole INT NOT NULL,

    MaKhachHang INT NULL,
    MaNhanVien INT NULL,

    TenDangNhap VARCHAR(100) NOT NULL,
    MatKhauHash VARCHAR(255) NOT NULL,

    TrangThaiTaiKhoan NVARCHAR(50) NOT NULL,
    NgayTao DATETIME NOT NULL,

    CONSTRAINT PK_TAI_KHOAN
        PRIMARY KEY (MaTaiKhoan),

    CONSTRAINT UQ_TAI_KHOAN_TenDangNhap
        UNIQUE (TenDangNhap),

    CONSTRAINT FK_TAI_KHOAN_ROLE
        FOREIGN KEY (MaRole)
        REFERENCES ROLE(MaRole),

    CONSTRAINT FK_TAI_KHOAN_KHACH_HANG
        FOREIGN KEY (MaKhachHang)
        REFERENCES KHACH_HANG(MaKhachHang),

    CONSTRAINT FK_TAI_KHOAN_NHAN_VIEN
        FOREIGN KEY (MaNhanVien)
        REFERENCES NHAN_VIEN(MaNhanVien)
);
GO

CREATE INDEX IX_TAI_KHOAN_MaRole
ON TAI_KHOAN(MaRole);
GO

CREATE INDEX IX_TAI_KHOAN_MaKhachHang
ON TAI_KHOAN(MaKhachHang);
GO

CREATE INDEX IX_TAI_KHOAN_MaNhanVien
ON TAI_KHOAN(MaNhanVien);
GO

--Nếu cảm giác tạo thiếu hoặc sai 
/*USE master;
GO

-- Đổi sang chế độ 1 người dùng và ngắt ngay lập tức mọi kết nối đang tồn tại
ALTER DATABASE QL_RAP_CHIEU_PHIM
SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

-- Thực hiện xóa CSDL
DROP DATABASE QL_RAP_CHIEU_PHIM;
GO*/

USE QL_RAP_CHIEU_PHIM;
GO

-- 1. Danh sách tất cả TABLE
SELECT 
    ROW_NUMBER() OVER (ORDER BY TABLE_NAME) AS STT,
    TABLE_NAME AS TenBang
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO

-- 2. Đếm tổng số TABLE
SELECT COUNT(*) AS TongSoBang
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';
GO

SELECT 
    (SELECT COUNT(*)
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_TYPE = 'BASE TABLE') AS TongSoBang,

    (SELECT COUNT(*)
     FROM sys.foreign_keys) AS TongSoQuanHe;
