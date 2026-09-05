USE QL_RAP_CHIEU_PHIM;
GO

-- =========================================================
-- FUNCTION: FN_TinhTienVe
-- Mục đích:
--   Tính tiền của một vé dựa trên:
--   - Loại vé
--   - Loại ghế
--
-- Công thức:
--   Giá vé = Giá vé cơ bản + Phụ thu loại ghế
-- =========================================================

CREATE OR ALTER FUNCTION FN_TinhTienVe
(
    @MaLoaiVe INT,       -- Mã loại vé
    @MaLoaiGhe INT       -- Mã loại ghế
)
RETURNS DECIMAL(18,2)
AS
BEGIN

    -- Biến lưu giá vé cơ bản
    DECLARE @GiaVeCoBan DECIMAL(18,2);

    -- Biến lưu phụ thu loại ghế
    DECLARE @PhuThu DECIMAL(18,2);

    -- =====================================================
    -- LẤY GIÁ VÉ CƠ BẢN
    -- =====================================================
    SELECT TOP 1
        @GiaVeCoBan = GiaVeCoBan
    FROM GIA_VE
    WHERE MaLoaiVe = @MaLoaiVe
      AND CAST(GETDATE() AS DATE)
          BETWEEN NgayApDung AND NgayKetThuc
    ORDER BY NgayApDung DESC;

    -- =====================================================
    -- LẤY PHỤ THU LOẠI GHẾ
    -- =====================================================
    SELECT
        @PhuThu = PhuThu
    FROM LOAI_GHE
    WHERE MaLoaiGhe = @MaLoaiGhe;

    -- =====================================================
    -- TRẢ VỀ TIỀN VÉ
    -- =====================================================
    RETURN ISNULL(@GiaVeCoBan, 0)
         + ISNULL(@PhuThu, 0);

END;
GO