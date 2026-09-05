USE QL_RAP_CHIEU_PHIM;
GO

CREATE OR ALTER PROCEDURE SP_T05_DangKyKhachHang
    @MaKhachHang INT,
    @HoTen NVARCHAR(150),
    @SoDienThoai VARCHAR(20),
    @Email VARCHAR(150) = NULL,
    @MaTaiKhoan INT,
    @TenDangNhap VARCHAR(100),
    @MatKhauHash VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        /* =====================================================
           1. KIỂM TRA DỮ LIỆU BẮT BUỘC
           ===================================================== */
        IF @HoTen IS NULL
           OR LTRIM(RTRIM(@HoTen)) = ''
        BEGIN
            THROW 50501,
                  N'Họ tên không được để trống.', 1;
        END;

        IF @SoDienThoai IS NULL
           OR LTRIM(RTRIM(@SoDienThoai)) = ''
        BEGIN
            THROW 50502,
                  N'Số điện thoại không được để trống.', 1;
        END;

        IF @TenDangNhap IS NULL
           OR LTRIM(RTRIM(@TenDangNhap)) = ''
        BEGIN
            THROW 50503,
                  N'Tên đăng nhập không được để trống.', 1;
        END;

        IF @MatKhauHash IS NULL
           OR LTRIM(RTRIM(@MatKhauHash)) = ''
        BEGIN
            THROW 50504,
                  N'Mật khẩu không được để trống.', 1;
        END;


        /* =====================================================
           2. KIỂM TRA MÃ KHÁCH HÀNG
           ===================================================== */
        IF EXISTS
        (
            SELECT 1
            FROM KHACH_HANG
            WHERE MaKhachHang = @MaKhachHang
        )
        BEGIN
            THROW 50505,
                  N'Mã khách hàng đã tồn tại.', 1;
        END;


        /* =====================================================
           3. KIỂM TRA SỐ ĐIỆN THOẠI
           ===================================================== */
        IF EXISTS
        (
            SELECT 1
            FROM KHACH_HANG
            WHERE SoDienThoai = @SoDienThoai
        )
        BEGIN
            THROW 50506,
                  N'Số điện thoại đã được đăng ký.', 1;
        END;


        /* =====================================================
           4. KIỂM TRA EMAIL
           ===================================================== */
        IF @Email IS NOT NULL
           AND LTRIM(RTRIM(@Email)) <> ''
           AND EXISTS
           (
               SELECT 1
               FROM KHACH_HANG
               WHERE Email = @Email
           )
        BEGIN
            THROW 50507,
                  N'Email đã được đăng ký.', 1;
        END;


        /* =====================================================
           5. KIỂM TRA TÊN ĐĂNG NHẬP
           ===================================================== */
        IF EXISTS
        (
            SELECT 1
            FROM TAI_KHOAN
            WHERE TenDangNhap = @TenDangNhap
        )
        BEGIN
            THROW 50508,
                  N'Tên đăng nhập đã tồn tại.', 1;
        END;


        /* =====================================================
           6. KIỂM TRA MÃ TÀI KHOẢN
           ===================================================== */
        IF EXISTS
        (
            SELECT 1
            FROM TAI_KHOAN
            WHERE MaTaiKhoan = @MaTaiKhoan
        )
        BEGIN
            THROW 50509,
                  N'Mã tài khoản đã tồn tại.', 1;
        END;


        /* =====================================================
           7. KIỂM TRA ROLE CUSTOMER
           ===================================================== */
        DECLARE @MaRole INT;

        SELECT @MaRole = MaRole
        FROM ROLE
        WHERE TenRole = 'CUSTOMER';

        IF @MaRole IS NULL
        BEGIN
            THROW 50510,
                  N'Role CUSTOMER chưa tồn tại.', 1;
        END;


        /* =====================================================
           8. TẠO KHÁCH HÀNG
           ===================================================== */
        INSERT INTO KHACH_HANG
        (
            MaKhachHang,
            HoTen,
            SoDienThoai,
            Email,
            DiemTichLuy
        )
        VALUES
        (
            @MaKhachHang,
            @HoTen,
            @SoDienThoai,
            NULLIF(LTRIM(RTRIM(@Email)), ''),
            0
        );


        /* =====================================================
           9. TẠO TÀI KHOẢN + GÁN ROLE CUSTOMER
           ===================================================== */
        INSERT INTO TAI_KHOAN
        (
            MaTaiKhoan,
            MaRole,
            MaKhachHang,
            MaNhanVien,
            TenDangNhap,
            MatKhauHash,
            TrangThaiTaiKhoan,
            NgayTao
        )
        VALUES
        (
            @MaTaiKhoan,
            @MaRole,
            @MaKhachHang,
            NULL,
            @TenDangNhap,
            @MatKhauHash,
            N'Hoạt động',
            GETDATE()
        );


        /* =====================================================
           10. COMMIT TRANSACTION
           ===================================================== */
        COMMIT TRANSACTION;


        /* =====================================================
           11. TRẢ KẾT QUẢ ĐĂNG KÝ
           ===================================================== */
        SELECT
            KH.MaKhachHang,
            KH.HoTen,
            KH.SoDienThoai,
            KH.Email,
            KH.DiemTichLuy,

            TK.MaTaiKhoan,
            TK.TenDangNhap,
            R.TenRole,
            TK.TrangThaiTaiKhoan,
            TK.NgayTao

        FROM KHACH_HANG KH
        INNER JOIN TAI_KHOAN TK
            ON TK.MaKhachHang = KH.MaKhachHang
        INNER JOIN ROLE R
            ON R.MaRole = TK.MaRole

        WHERE KH.MaKhachHang = @MaKhachHang
          AND TK.MaTaiKhoan = @MaTaiKhoan;

    END TRY

    BEGIN CATCH

        /* =====================================================
           12. CÓ LỖI → ROLLBACK TOÀN BỘ TRANSACTION
           ===================================================== */
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END;
GO