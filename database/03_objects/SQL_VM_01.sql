USE QL_RAP_CHIEU_PHIM;
GO

-- =============================================
-- VIEW: VW_LichChieuPhim
-- Mục đích:
--   Hiển thị thông tin lịch chiếu phim,
--   bao gồm phim, rạp, phòng và thời gian chiếu.
-- =============================================

CREATE OR ALTER VIEW VW_LichChieuPhim
AS
SELECT
    -- Thông tin suất chiếu
    SC.MaSuatChieu,              -- Mã suất chiếu
    SC.MaPhim,                   -- Mã phim

    -- Thông tin phim
    P.TenPhim,                   -- Tên phim

    -- Thông tin rạp
    R.MaRap,                     -- Mã rạp
    R.TenRap,                    -- Tên rạp

    -- Thông tin phòng chiếu
    PC.MaPhong,                  -- Mã phòng
    PC.TenPhong,                 -- Tên phòng

    -- Thời gian và trạng thái suất chiếu
    SC.NgayChieu,                -- Ngày chiếu
    SC.GioBatDau,                -- Giờ bắt đầu
    SC.GioKetThuc,               -- Giờ kết thúc
    SC.TrangThaiSuatChieu        -- Trạng thái suất chiếu

FROM SUAT_CHIEU SC

-- Kết nối suất chiếu với phim
INNER JOIN PHIM P
    ON P.MaPhim = SC.MaPhim

-- Kết nối suất chiếu với phòng chiếu
INNER JOIN PHONG_CHIEU PC
    ON PC.MaPhong = SC.MaPhong

-- Kết nối phòng chiếu với rạp
INNER JOIN RAP R
    ON R.MaRap = PC.MaRap;
GO

-- =========================================================
-- KIỂM TRA VIEW
-- =========================================================

-- Hiển thị toàn bộ thông tin lịch chiếu phim 
SELECT *
FROM VW_LichChieuPhim;