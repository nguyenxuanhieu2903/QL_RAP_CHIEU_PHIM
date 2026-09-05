USE QL_RAP_CHIEU_PHIM;
GO

-- =========================================================
-- FUNCTION: FN_TinhTongTienDatVe
-- Mục đích:
--   Tính tổng tiền của tất cả vé trong một đơn đặt vé.
--
-- Tham số:
--   @MaDatVe: Mã đơn đặt vé cần tính.
--
-- Giá trị trả về:
--   Tổng tiền của các vé trong đơn.
-- =========================================================

CREATE OR ALTER FUNCTION FN_TinhTongTienDatVe
(
    @MaDatVe INT
)
RETURNS DECIMAL(18,2)
AS
BEGIN

    -- Biến lưu tổng tiền của đơn đặt vé
    DECLARE @TongTien DECIMAL(18,2);

    -- Tính tổng giá của các vé thuộc đơn
    SELECT
        @TongTien = ISNULL(
            SUM(CT.GiaTaiThoiDiemDat),
            0
        )
    FROM CHI_TIET_DAT_VE CT

    -- Chỉ lấy các vé thuộc đơn đặt vé được truyền vào
    WHERE CT.MaDatVe = @MaDatVe;

    -- Trả về tổng tiền
    RETURN @TongTien;

END;
GO


-- =========================================================
-- KIỂM TRA FUNCTION
-- =========================================================

-- Tính tổng tiền của đơn đặt vé có mã 1
SELECT dbo.FN_TinhTongTienDatVe(1) AS TongTien;