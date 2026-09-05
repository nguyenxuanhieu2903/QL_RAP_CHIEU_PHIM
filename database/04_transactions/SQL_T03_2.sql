USE QL_RAP_CHIEU_PHIM;
GO

CREATE OR ALTER PROCEDURE SP_T03_HuyVe
    @MaDatVe INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;


        /* =====================================================
           1. KIỂM TRA ĐƠN ĐẶT VÉ
           - Đơn phải tồn tại
           - Khóa đơn trong suốt quá trình xử lý
           ===================================================== */
        IF NOT EXISTS
        (
            SELECT 1
            FROM DAT_VE WITH (UPDLOCK, HOLDLOCK)
            WHERE MaDatVe = @MaDatVe
        )
        BEGIN
            THROW 50201, N'Đơn đặt vé không tồn tại.', 1;
        END;


        /* =====================================================
           2. LẤY THÔNG TIN ĐƠN
           ===================================================== */
        DECLARE @TrangThai NVARCHAR(50);

        SELECT
            @TrangThai = TrangThai
        FROM DAT_VE
        WHERE MaDatVe = @MaDatVe;


        /* =====================================================
           3. KIỂM TRA ĐIỀU KIỆN ĐƯỢC HỦY
           - Không được hủy đơn đã hủy
           - Chỉ cho phép hủy đơn đang chờ thanh toán
             hoặc đã thanh toán
           ===================================================== */
        IF @TrangThai = N'Đã hủy'
        BEGIN
            THROW 50202,
                  N'Đơn đặt vé đã được hủy trước đó.', 1;
        END;

        IF @TrangThai NOT IN
        (
            N'Chờ thanh toán',
            N'Đã thanh toán'
        )
        BEGIN
            THROW 50203,
                  N'Đơn đặt vé không ở trạng thái được phép hủy.', 1;
        END;


        /* =====================================================
           4. KIỂM TRA ĐƠN CÓ CHI TIẾT VÉ KHÔNG
           ===================================================== */
        IF NOT EXISTS
        (
            SELECT 1
            FROM CHI_TIET_DAT_VE
            WHERE MaDatVe = @MaDatVe
        )
        BEGIN
            THROW 50204,
                  N'Đơn đặt vé không có chi tiết vé.', 1;
        END;


        /* =====================================================
           5. KIỂM TRA CÁC GHẾ CỦA ĐƠN
           - Đảm bảo các ghế trong chi tiết đặt vé
             vẫn tồn tại trong GHE_SUATCHIEU
           ===================================================== */
        IF EXISTS
        (
            SELECT 1
            FROM CHI_TIET_DAT_VE CT
            LEFT JOIN GHE_SUATCHIEU GS
                ON GS.MaSuatChieu = CT.MaSuatChieu
               AND GS.MaGhe = CT.MaGhe
            WHERE CT.MaDatVe = @MaDatVe
              AND GS.MaSuatChieu IS NULL
        )
        BEGIN
            THROW 50205,
                  N'Dữ liệu ghế của đơn đặt vé không hợp lệ.', 1;
        END;


        /* =====================================================
           6. TRẢ GHẾ VỀ TRẠNG THÁI TRỐNG
           ===================================================== */
        UPDATE GS
        SET TrangThaiDat = N'Trống'
        FROM GHE_SUATCHIEU GS
        INNER JOIN CHI_TIET_DAT_VE CT
            ON CT.MaSuatChieu = GS.MaSuatChieu
           AND CT.MaGhe = GS.MaGhe
        WHERE CT.MaDatVe = @MaDatVe;


        /* =====================================================
           7. CẬP NHẬT TRẠNG THÁI ĐƠN
           ===================================================== */
        UPDATE DAT_VE
        SET TrangThai = N'Đã hủy'
        WHERE MaDatVe = @MaDatVe;


        /* =====================================================
           8. CẬP NHẬT TRẠNG THÁI THANH TOÁN
           - Nếu đơn đã thanh toán thì chuyển giao dịch
             sang trạng thái "Đã hủy"
           - Nếu chưa thanh toán thì không có bản ghi
             thành công để cập nhật
           ===================================================== */
        UPDATE THANH_TOAN
        SET TrangThaiThanhToan = N'Đã hủy'
        WHERE MaDatVe = @MaDatVe
          AND TrangThaiThanhToan = N'Thành công';


        /* =====================================================
           9. COMMIT TRANSACTION
           ===================================================== */
        COMMIT TRANSACTION;


        /* =====================================================
           10. TRẢ KẾT QUẢ
           ===================================================== */
        SELECT
            DV.MaDatVe,
            DV.MaKhachHang,
            DV.TongTien,
            DV.TrangThai,

            TT.MaThanhToan,
            TT.ThoiGianThanhToan,
            TT.SoTien,
            TT.PhuongThuc,
            TT.TrangThaiThanhToan

        FROM DAT_VE DV
        LEFT JOIN THANH_TOAN TT
            ON TT.MaDatVe = DV.MaDatVe
        WHERE DV.MaDatVe = @MaDatVe;


    END TRY

    BEGIN CATCH

        /* =====================================================
           CÓ LỖI → ROLLBACK TOÀN BỘ TRANSACTION
           ===================================================== */
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END;
GO