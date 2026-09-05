USE QL_RAP_CHIEU_PHIM;
GO

CREATE OR ALTER PROCEDURE SP_T02_ThanhToan
    @MaThanhToan INT,
    @MaDatVe INT,
    @PhuongThuc NVARCHAR(50),
    @MaGiaoDich VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        /* =================================================
           1. KIỂM TRA ĐƠN ĐẶT VÉ
           ================================================= */
        IF NOT EXISTS
        (
            SELECT 1
            FROM DAT_VE WITH (UPDLOCK, HOLDLOCK)
            WHERE MaDatVe = @MaDatVe
        )
        BEGIN
            THROW 50101, N'Đơn đặt vé không tồn tại.', 1;
        END;


        /* =================================================
           2. LẤY THÔNG TIN ĐƠN
           ================================================= */
        DECLARE @TongTien DECIMAL(18,2);
        DECLARE @TrangThai NVARCHAR(50);

        SELECT
            @TongTien = TongTien,
            @TrangThai = TrangThai
        FROM DAT_VE
        WHERE MaDatVe = @MaDatVe;


        /* =================================================
           3. KIỂM TRA TRẠNG THÁI ĐƠN
           ================================================= */
        IF @TrangThai <> N'Chờ thanh toán'
        BEGIN
            THROW 50102, N'Đơn đặt vé không ở trạng thái chờ thanh toán.', 1;
        END;


        /* =================================================
           4. KIỂM TRA PHƯƠNG THỨC THANH TOÁN
           ================================================= */
        IF @PhuongThuc IS NULL
           OR LTRIM(RTRIM(@PhuongThuc)) = N''
        BEGIN
            THROW 50103, N'Phương thức thanh toán không hợp lệ.', 1;
        END;


        /* =================================================
           5. KIỂM TRA SỐ TIỀN
           ================================================= */
        IF @TongTien IS NULL OR @TongTien <= 0
        BEGIN
            THROW 50104, N'Tổng tiền của đơn đặt vé không hợp lệ.', 1;
        END;


        /* =================================================
           6. KIỂM TRA MÃ THANH TOÁN
           ================================================= */
        IF EXISTS
        (
            SELECT 1
            FROM THANH_TOAN
            WHERE MaThanhToan = @MaThanhToan
        )
        BEGIN
            THROW 50105, N'Mã thanh toán đã tồn tại.', 1;
        END;


        /* =================================================
           7. KIỂM TRA ĐƠN ĐÃ CÓ THANH TOÁN THÀNH CÔNG
           ================================================= */
        IF EXISTS
        (
            SELECT 1
            FROM THANH_TOAN
            WHERE MaDatVe = @MaDatVe
              AND TrangThaiThanhToan = N'Thành công'
        )
        BEGIN
            THROW 50106, N'Đơn đặt vé đã được thanh toán.', 1;
        END;


        /* =================================================
           8. TẠO THANH TOÁN
           ================================================= */
        INSERT INTO THANH_TOAN
        (
            MaThanhToan,
            MaDatVe,
            ThoiGianThanhToan,
            SoTien,
            PhuongThuc,
            TrangThaiThanhToan,
            MaGiaoDich
        )
        VALUES
        (
            @MaThanhToan,
            @MaDatVe,
            GETDATE(),
            @TongTien,
            @PhuongThuc,
            N'Thành công',
            @MaGiaoDich
        );


        /* =================================================
           9. CẬP NHẬT TRẠNG THÁI ĐƠN
           ================================================= */
        UPDATE DAT_VE
        SET TrangThai = N'Đã thanh toán'
        WHERE MaDatVe = @MaDatVe;


        /* =================================================
           10. COMMIT
           ================================================= */
        COMMIT TRANSACTION;


        /* =================================================
           11. TRẢ KẾT QUẢ
           ================================================= */
        SELECT
            DV.MaDatVe,
            DV.TongTien,
            DV.TrangThai,
            TT.MaThanhToan,
            TT.ThoiGianThanhToan,
            TT.SoTien,
            TT.PhuongThuc,
            TT.TrangThaiThanhToan,
            TT.MaGiaoDich
        FROM DAT_VE AS DV
        INNER JOIN THANH_TOAN AS TT
            ON TT.MaDatVe = DV.MaDatVe
        WHERE DV.MaDatVe = @MaDatVe
          AND TT.MaThanhToan = @MaThanhToan;


    END TRY

    BEGIN CATCH

        /* =================================================
           CÓ LỖI → ROLLBACK
           ================================================= */
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END;
GO