USE QL_RAP_CHIEU_PHIM;
GO

CREATE OR ALTER PROCEDURE SP_T04_TaoSuatChieu
    @MaSuatChieu INT,
    @MaPhim INT,
    @MaPhong INT,
    @NgayChieu DATE,
    @GioBatDau TIME,
    @GioKetThuc TIME
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        /* =====================================================
           1. KIỂM TRA MÃ SUẤT CHIẾU
           ===================================================== */
        IF EXISTS
        (
            SELECT 1
            FROM SUAT_CHIEU
            WHERE MaSuatChieu = @MaSuatChieu
        )
        BEGIN
            THROW 50401,
                  N'Mã suất chiếu đã tồn tại.', 1;
        END;


        /* =====================================================
           2. KIỂM TRA PHIM
           ===================================================== */
        IF NOT EXISTS
        (
            SELECT 1
            FROM PHIM
            WHERE MaPhim = @MaPhim
        )
        BEGIN
            THROW 50402,
                  N'Phim không tồn tại.', 1;
        END;


        /* =====================================================
           3. KIỂM TRA PHÒNG CHIẾU
           ===================================================== */
        IF NOT EXISTS
        (
            SELECT 1
            FROM PHONG_CHIEU
            WHERE MaPhong = @MaPhong
        )
        BEGIN
            THROW 50403,
                  N'Phòng chiếu không tồn tại.', 1;
        END;


        /* =====================================================
           4. KIỂM TRA THỜI GIAN
           ===================================================== */
        IF @GioBatDau >= @GioKetThuc
        BEGIN
            THROW 50404,
                  N'Giờ bắt đầu phải nhỏ hơn giờ kết thúc.', 1;
        END;


        /* =====================================================
           5. KIỂM TRA NGÀY CHIẾU
           ===================================================== */
        IF @NgayChieu < CAST(GETDATE() AS DATE)
        BEGIN
            THROW 50405,
                  N'Ngày chiếu không được nhỏ hơn ngày hiện tại.', 1;
        END;


        /* =====================================================
           6. KIỂM TRA TRÙNG SUẤT CHIẾU
              Cùng phòng + cùng ngày + thời gian giao nhau
           ===================================================== */
        IF EXISTS
        (
            SELECT 1
            FROM SUAT_CHIEU WITH (UPDLOCK, HOLDLOCK)
            WHERE MaPhong = @MaPhong
              AND NgayChieu = @NgayChieu
              AND @GioBatDau < GioKetThuc
              AND @GioKetThuc > GioBatDau
        )
        BEGIN
            THROW 50406,
                  N'Phòng chiếu đã có suất chiếu trùng thời gian.', 1;
        END;


        /* =====================================================
           7. KIỂM TRA PHÒNG ĐÃ CÓ GHẾ
           ===================================================== */
        IF NOT EXISTS
        (
            SELECT 1
            FROM GHE
            WHERE MaPhong = @MaPhong
        )
        BEGIN
            THROW 50407,
                  N'Phòng chiếu chưa có ghế.', 1;
        END;


        /* =====================================================
           8. TẠO SUẤT CHIẾU
           ===================================================== */
        INSERT INTO SUAT_CHIEU
        (
            MaSuatChieu,
            MaPhim,
            MaPhong,
            NgayChieu,
            GioBatDau,
            GioKetThuc,
            TrangThaiSuatChieu
        )
        VALUES
        (
            @MaSuatChieu,
            @MaPhim,
            @MaPhong,
            @NgayChieu,
            @GioBatDau,
            @GioKetThuc,
            N'Đang chiếu'
        );


        /* =====================================================
           9. KHỞI TẠO GHẾ CHO SUẤT CHIẾU
           ===================================================== */
        INSERT INTO GHE_SUATCHIEU
        (
            MaSuatChieu,
            MaGhe,
            TrangThaiDat
        )
        SELECT
            @MaSuatChieu,
            G.MaGhe,
            N'Trống'
        FROM GHE G
        WHERE G.MaPhong = @MaPhong;


        /* =====================================================
           10. KIỂM TRA VIỆC KHỞI TẠO GHẾ
           ===================================================== */
        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50408,
                  N'Không thể khởi tạo ghế cho suất chiếu.',
                  1;
        END;


        /* =====================================================
           11. HOÀN TẤT GIAO TÁC
           ===================================================== */
        COMMIT TRANSACTION;


        /* =====================================================
           12. TRẢ KẾT QUẢ
           ===================================================== */
        SELECT
            SC.MaSuatChieu,
            SC.MaPhim,
            P.TenPhim,
            SC.MaPhong,
            PC.TenPhong,
            SC.NgayChieu,
            SC.GioBatDau,
            SC.GioKetThuc,
            SC.TrangThaiSuatChieu,
            COUNT(GS.MaGhe) AS SoLuongGhe
        FROM SUAT_CHIEU SC
        INNER JOIN PHIM P
            ON P.MaPhim = SC.MaPhim
        INNER JOIN PHONG_CHIEU PC
            ON PC.MaPhong = SC.MaPhong
        LEFT JOIN GHE_SUATCHIEU GS
            ON GS.MaSuatChieu = SC.MaSuatChieu
        WHERE SC.MaSuatChieu = @MaSuatChieu
        GROUP BY
            SC.MaSuatChieu,
            SC.MaPhim,
            P.TenPhim,
            SC.MaPhong,
            PC.TenPhong,
            SC.NgayChieu,
            SC.GioBatDau,
            SC.GioKetThuc,
            SC.TrangThaiSuatChieu;

    END TRY

    BEGIN CATCH

        /* =====================================================
           13. CÓ LỖI → ROLLBACK TOÀN BỘ
           ===================================================== */
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END;
GO