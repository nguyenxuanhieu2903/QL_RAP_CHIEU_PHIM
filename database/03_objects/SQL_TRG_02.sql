USE QL_RAP_CHIEU_PHIM;
GO

-- =========================================================
-- TRIGGER: TRG_CapNhatTongTien
-- Mục đích:
-- Tự động cập nhật DAT_VE.TongTien
-- khi thêm chi tiết vé vào CHI_TIET_DAT_VE
-- =========================================================

CREATE OR ALTER TRIGGER TRG_CapNhatTongTien
ON CHI_TIET_DAT_VE
AFTER INSERT
AS
BEGIN
    -- Không trả về thông báo "(x rows affected)"
    SET NOCOUNT ON;

    -- =====================================================
    -- Cập nhật tổng tiền cho các đơn đặt vé vừa phát sinh
    -- =====================================================
    UPDATE DV
    SET DV.TongTien = T.TongTien

    FROM DAT_VE DV

    -- =====================================================
    -- Tạo bảng tạm T:
    -- - Lấy các chi tiết vé thuộc những đơn vừa INSERT
    -- - SUM(GiaTaiThoiDiemDat) để tính tổng tiền
    -- - GROUP BY MaDatVe để tính riêng từng đơn
    -- =====================================================
    INNER JOIN
    (
        SELECT
            CT.MaDatVe,

            -- Tính tổng tiền của toàn bộ vé trong đơn
            SUM(CT.GiaTaiThoiDiemDat) AS TongTien

        FROM CHI_TIET_DAT_VE CT

        -- inserted chứa các dòng vừa được INSERT
        -- vào CHI_TIET_DAT_VE
        INNER JOIN inserted I
            ON I.MaDatVe = CT.MaDatVe

        -- Gom các chi tiết theo từng đơn đặt vé
        GROUP BY CT.MaDatVe

    ) T

        -- Ghép kết quả tổng tiền với đơn đặt vé tương ứng
        ON T.MaDatVe = DV.MaDatVe;

END;
GO