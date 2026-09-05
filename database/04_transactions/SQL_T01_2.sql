USE QL_RAP_CHIEU_PHIM;
GO

CREATE OR ALTER PROCEDURE SP_T01_DatVe
    @MaDatVe INT,
    @MaKhachHang INT,
    @MaSuatChieu INT,
    @MaLoaiVe INT,
    @MaKhuyenMai INT = NULL,
    @MaNhanVien INT = NULL,
    @DanhSachMaGhe VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        /* =====================================================
           T01 - ĐẶT VÉ XEM PHIM
           
           Flow:
           Kiểm tra suất chiếu
           → Kiểm tra ghế
           → Tạo DAT_VE
           → Tạo CHI_TIET_DAT_VE
           → Cập nhật GHE_SUATCHIEU
           → COMMIT
           
           Có lỗi → ROLLBACK
           ===================================================== */

        BEGIN TRANSACTION;


        /* =====================================================
           1. KIỂM TRA KHÁCH HÀNG
           ===================================================== */

        IF NOT EXISTS
        (
            SELECT 1
            FROM KHACH_HANG
            WHERE MaKhachHang = @MaKhachHang
        )
        BEGIN
            THROW 50001, N'Khách hàng không tồn tại.', 1;
        END;


        /* =====================================================
           2. KIỂM TRA SUẤT CHIẾU
           ===================================================== */

        IF NOT EXISTS
        (
            SELECT 1
            FROM SUAT_CHIEU
            WHERE MaSuatChieu = @MaSuatChieu
              AND TrangThaiSuatChieu = N'Đang chiếu'
        )
        BEGIN
            THROW 50002,
                  N'Suất chiếu không tồn tại hoặc không hoạt động.', 1;
        END;


        /* =====================================================
           3. KIỂM TRA LOẠI VÉ
           ===================================================== */

        IF NOT EXISTS
        (
            SELECT 1
            FROM LOAI_VE
            WHERE MaLoaiVe = @MaLoaiVe
        )
        BEGIN
            THROW 50003, N'Loại vé không tồn tại.', 1;
        END;


        /* =====================================================
           4. KIỂM TRA KHUYẾN MÃI
           ===================================================== */

        IF @MaKhuyenMai IS NOT NULL
        BEGIN
            IF NOT EXISTS
            (
                SELECT 1
                FROM KHUYEN_MAI
                WHERE MaKhuyenMai = @MaKhuyenMai
                  AND CAST(GETDATE() AS DATE)
                      BETWEEN NgayBatDau AND NgayKetThuc
            )
            BEGIN
                THROW 50004,
                      N'Khuyến mãi không tồn tại hoặc đã hết hạn.', 1;
            END;
        END;


        /* =====================================================
           5. TÁCH DANH SÁCH GHẾ
           
           Ví dụ:
           @DanhSachMaGhe = '10101,10102,10103'
           ===================================================== */

        DECLARE @Ghe TABLE
        (
            MaGhe INT PRIMARY KEY
        );

        INSERT INTO @Ghe (MaGhe)
        SELECT DISTINCT
            TRY_CAST(LTRIM(RTRIM(value)) AS INT)
        FROM STRING_SPLIT(@DanhSachMaGhe, ',')
        WHERE TRY_CAST(LTRIM(RTRIM(value)) AS INT) IS NOT NULL;


        IF NOT EXISTS
        (
            SELECT 1
            FROM @Ghe
        )
        BEGIN
            THROW 50005, N'Danh sách ghế không hợp lệ.', 1;
        END;


        /* =====================================================
           6. KIỂM TRA GHẾ THUỘC PHÒNG CỦA SUẤT CHIẾU
           ===================================================== */

        IF EXISTS
        (
            SELECT 1
            FROM @Ghe G
            LEFT JOIN GHE GE
                ON GE.MaGhe = G.MaGhe
            INNER JOIN SUAT_CHIEU SC
                ON SC.MaSuatChieu = @MaSuatChieu
            WHERE GE.MaGhe IS NULL
               OR GE.MaPhong <> SC.MaPhong
        )
        BEGIN
            THROW 50006,
                  N'Có ghế không thuộc phòng của suất chiếu.', 1;
        END;


        /* =====================================================
           7. KIỂM TRA GHẾ ĐÃ ĐƯỢC KHỞI TẠO CHO SUẤT CHIẾU
           ===================================================== */

        IF EXISTS
        (
            SELECT 1
            FROM @Ghe G
            LEFT JOIN GHE_SUATCHIEU GS
                ON GS.MaSuatChieu = @MaSuatChieu
               AND GS.MaGhe = G.MaGhe
            WHERE GS.MaGhe IS NULL
        )
        BEGIN
            THROW 50007,
                  N'Có ghế chưa được khởi tạo cho suất chiếu.', 1;
        END;


        /* =====================================================
           8. KHÓA GHẾ + KIỂM TRA GHẾ CÒN TRỐNG
           
           UPDLOCK:
           Đặt khóa cập nhật trên các dòng ghế.

           HOLDLOCK:
           Giữ khóa đến khi transaction kết thúc.
           
           → Phục vụ xử lý tranh chấp khi nhiều người
             cùng đặt một ghế.
           ===================================================== */

        IF EXISTS
        (
            SELECT 1
            FROM GHE_SUATCHIEU GS WITH (UPDLOCK, HOLDLOCK)
            INNER JOIN @Ghe G
                ON G.MaGhe = GS.MaGhe
            WHERE GS.MaSuatChieu = @MaSuatChieu
              AND GS.TrangThaiDat <> N'Trống'
        )
        BEGIN
            THROW 50008,
                  N'Có ghế đã được đặt. Vui lòng chọn ghế khác.', 1;
        END;


        /* =====================================================
           9. LẤY GIÁ VÉ HIỆN HÀNH
           ===================================================== */

        DECLARE @GiaVeCoBan DECIMAL(18,2);

        SELECT TOP 1
            @GiaVeCoBan = GiaVeCoBan
        FROM GIA_VE
        WHERE MaLoaiVe = @MaLoaiVe
          AND CAST(GETDATE() AS DATE)
              BETWEEN NgayApDung AND NgayKetThuc
        ORDER BY NgayApDung DESC;


        IF @GiaVeCoBan IS NULL
        BEGIN
            THROW 50009,
                  N'Không tìm thấy giá vé đang áp dụng.', 1;
        END;


        /* =====================================================
           10. TÍNH TỔNG TIỀN
           
           Giá vé mỗi ghế:
           Giá cơ bản + Phụ thu loại ghế
           ===================================================== */

        DECLARE @TongTienTruocGiam DECIMAL(18,2);
        DECLARE @PhanTramGiam DECIMAL(5,2) = 0;
        DECLARE @TongTien DECIMAL(18,2);

        SELECT
            @TongTienTruocGiam =
                SUM(@GiaVeCoBan + LG.PhuThu)
        FROM @Ghe G
        INNER JOIN GHE GE
            ON GE.MaGhe = G.MaGhe
        INNER JOIN LOAI_GHE LG
            ON LG.MaLoaiGhe = GE.MaLoaiGhe;


        /* =====================================================
           11. LẤY PHẦN TRĂM KHUYẾN MÃI
           ===================================================== */

        IF @MaKhuyenMai IS NOT NULL
        BEGIN
            SELECT
                @PhanTramGiam = PhanTramGiam
            FROM KHUYEN_MAI
            WHERE MaKhuyenMai = @MaKhuyenMai;
        END;


        SET @TongTien =
            @TongTienTruocGiam
            - (
                @TongTienTruocGiam
                * @PhanTramGiam
                / 100
              );


        /* =====================================================
           12. TẠO ĐƠN ĐẶT VÉ
           ===================================================== */

        INSERT INTO DAT_VE
        (
            MaDatVe,
            MaKhachHang,
            MaKhuyenMai,
            MaNhanVien,
            ThoiGianDat,
            TongTien,
            TrangThai
        )
        VALUES
        (
            @MaDatVe,
            @MaKhachHang,
            @MaKhuyenMai,
            @MaNhanVien,
            GETDATE(),
            @TongTien,
            N'Chờ thanh toán'
        );


        /* =====================================================
           13. SINH MÃ CHI TIẾT
           
           MaChiTiet hiện tại không dùng IDENTITY,
           nên tạm sinh mã tiếp theo trong transaction.
           ===================================================== */

        DECLARE @MaChiTietCuoi INT;

        SELECT
            @MaChiTietCuoi =
                ISNULL(MAX(MaChiTiet), 0)
        FROM CHI_TIET_DAT_VE WITH (UPDLOCK, HOLDLOCK);


        /* =====================================================
           14. TẠO CHI TIẾT ĐẶT VÉ
           ===================================================== */

        INSERT INTO CHI_TIET_DAT_VE
        (
            MaChiTiet,
            MaDatVe,
            MaSuatChieu,
            MaGhe,
            MaLoaiVe,
            GiaTaiThoiDiemDat
        )
        SELECT
            @MaChiTietCuoi
                + ROW_NUMBER() OVER (ORDER BY G.MaGhe),

            @MaDatVe,
            @MaSuatChieu,
            G.MaGhe,
            @MaLoaiVe,
            @GiaVeCoBan + LG.PhuThu

        FROM @Ghe G
        INNER JOIN GHE GE
            ON GE.MaGhe = G.MaGhe
        INNER JOIN LOAI_GHE LG
            ON LG.MaLoaiGhe = GE.MaLoaiGhe;


        /* =====================================================
           15. CẬP NHẬT TRẠNG THÁI GHẾ
           ===================================================== */

        UPDATE GS
        SET TrangThaiDat = N'Ghế đã đặt'
        FROM GHE_SUATCHIEU GS
        INNER JOIN @Ghe G
            ON G.MaGhe = GS.MaGhe
        WHERE GS.MaSuatChieu = @MaSuatChieu;


        /* =====================================================
           16. COMMIT
           ===================================================== */

        COMMIT TRANSACTION;


        /* =====================================================
           17. TRẢ KẾT QUẢ
           ===================================================== */

        SELECT
            DV.MaDatVe,
            DV.MaKhachHang,
            DV.MaKhuyenMai,
            DV.ThoiGianDat,
            DV.TongTien,
            DV.TrangThai
        FROM DAT_VE DV
        WHERE DV.MaDatVe = @MaDatVe;

    END TRY

    BEGIN CATCH

        /* =====================================================
           CÓ LỖI → ROLLBACK TOÀN BỘ
           ===================================================== */

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END;
GO
