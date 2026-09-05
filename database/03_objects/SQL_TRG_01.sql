USE QL_RAP_CHIEU_PHIM;
GO

-- =========================================================
-- TRIGGER: TRG_CapNhatTrangThaiGhe
-- Mục đích:
--   Tự động cập nhật trạng thái ghế trong GHE_SUATCHIEU
--   khi có chi tiết vé mới được thêm vào CHI_TIET_DAT_VE.
-- =========================================================

CREATE OR ALTER TRIGGER TRG_CapNhatTrangThaiGhe
ON CHI_TIET_DAT_VE
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- =====================================================
    -- Cập nhật trạng thái các ghế vừa được đặt
    -- =====================================================
    UPDATE GS
    SET GS.TrangThaiDat = N'Ghế đã đặt'
    FROM GHE_SUATCHIEU GS
    INNER JOIN inserted I
        ON GS.MaSuatChieu = I.MaSuatChieu
       AND GS.MaGhe = I.MaGhe;

END;
GO