USE QL_RAP_CHIEU_PHIM;
GO

-- =========================================================
-- VIEW: VW_ThongTinDatVe
-- Mục đích:
--   Tổng hợp thông tin của đơn đặt vé, bao gồm:
--   khách hàng, vé, ghế, suất chiếu, phim,
--   phòng, rạp và loại vé.
-- =========================================================

CREATE OR ALTER VIEW VW_ThongTinDatVe
AS
SELECT

    -- =====================================================
    -- THÔNG TIN ĐƠN ĐẶT VÉ
    -- =====================================================
    DV.MaDatVe,                   -- Mã đơn đặt vé
    DV.ThoiGianDat,               -- Thời gian đặt vé
    DV.TongTien,                  -- Tổng tiền của đơn
    DV.TrangThai,                 -- Trạng thái đơn đặt vé


    -- =====================================================
    -- THÔNG TIN KHÁCH HÀNG
    -- =====================================================
    KH.MaKhachHang,               -- Mã khách hàng
    KH.HoTen,                     -- Họ tên khách hàng
    KH.SoDienThoai,               -- Số điện thoại
    KH.Email,                     -- Email


    -- =====================================================
    -- THÔNG TIN CHI TIẾT VÉ
    -- =====================================================
    CT.MaChiTiet,                 -- Mã chi tiết vé
    CT.MaSuatChieu,               -- Mã suất chiếu
    CT.MaGhe,                     -- Mã ghế
    CT.MaLoaiVe,                  -- Mã loại vé
    CT.GiaTaiThoiDiemDat,         -- Giá vé tại thời điểm đặt


    -- =====================================================
    -- THÔNG TIN GHẾ
    -- =====================================================
    G.SoGhe,                      -- Số ghế
    G.HangGhe,                    -- Hàng ghế
    G.MaLoaiGhe,                  -- Mã loại ghế


    -- =====================================================
    -- THÔNG TIN PHÒNG CHIẾU
    -- =====================================================
    PC.MaPhong,                   -- Mã phòng chiếu
    PC.TenPhong,                  -- Tên phòng chiếu


    -- =====================================================
    -- THÔNG TIN RẠP
    -- =====================================================
    R.MaRap,                      -- Mã rạp
    R.TenRap,                     -- Tên rạp


    -- =====================================================
    -- THÔNG TIN PHIM
    -- =====================================================
    P.MaPhim,                     -- Mã phim
    P.TenPhim,                    -- Tên phim


    -- =====================================================
    -- THÔNG TIN SUẤT CHIẾU
    -- =====================================================
    SC.NgayChieu,                 -- Ngày chiếu
    SC.GioBatDau,                 -- Giờ bắt đầu
    SC.GioKetThuc,                -- Giờ kết thúc


    -- =====================================================
    -- THÔNG TIN LOẠI VÉ
    -- =====================================================
    LVT.TenLoaiVe                 -- Tên loại vé


FROM DAT_VE DV

-- Đơn đặt vé thuộc về khách hàng nào
INNER JOIN KHACH_HANG KH
    ON KH.MaKhachHang = DV.MaKhachHang

-- Lấy các vé thuộc đơn đặt vé
INNER JOIN CHI_TIET_DAT_VE CT
    ON CT.MaDatVe = DV.MaDatVe

-- Lấy thông tin ghế được đặt
INNER JOIN GHE G
    ON G.MaGhe = CT.MaGhe

-- Lấy thông tin suất chiếu của vé
INNER JOIN SUAT_CHIEU SC
    ON SC.MaSuatChieu = CT.MaSuatChieu

-- Từ suất chiếu lấy thông tin phim
INNER JOIN PHIM P
    ON P.MaPhim = SC.MaPhim

-- Từ suất chiếu lấy thông tin phòng chiếu
INNER JOIN PHONG_CHIEU PC
    ON PC.MaPhong = SC.MaPhong

-- Từ phòng chiếu xác định rạp
INNER JOIN RAP R
    ON R.MaRap = PC.MaRap

-- Lấy tên loại vé
INNER JOIN LOAI_VE LVT
    ON LVT.MaLoaiVe = CT.MaLoaiVe;

GO


-- =========================================================
-- KIỂM TRA VIEW
-- =========================================================

-- Hiển thị toàn bộ thông tin đặt vé
SELECT *
FROM VW_ThongTinDatVe;

-- Có thể lọc theo một đơn đặt vé cụ thể
-- SELECT *
-- FROM VW_ThongTinDatVe
-- WHERE MaDatVe = 1;