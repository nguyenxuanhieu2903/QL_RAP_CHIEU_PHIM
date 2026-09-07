const AppError = require('../../utils/error');

const {
    hashPassword,
    comparePassword,
} = require('../../utils/password');

const { generateToken } = require('../../utils/jwt');

const authRepository = require('./auth.repository');

const register = async ({
    username,
    password,
    email,
    fullName,
    phone,
}) => {
    // 1. Check username
    const existingAccount =
        await authRepository.findAccountByUsername(username);

    if (existingAccount) {
        throw new AppError(
            'Username already exists',
            409
        );
    }

    // 2. Check email
    const existingCustomer =
        await authRepository.findCustomerByEmail(email);

    if (existingCustomer) {
        throw new AppError(
            'Email already exists',
            409
        );
    }

    // 3. Hash password
    const passwordHash =
        await hashPassword(password);

    // 4. Create customer
    const customerId =
        await authRepository.createCustomer({
            fullName,
            phone,
            email,
        });

    // 5. Create account
    const accountId =
        await authRepository.createAccount({
            username,
            passwordHash,
            roleId: 1,
            customerId,
        });

    // 6. Generate JWT
    const token = generateToken({
        userId: accountId,
        role: 'CUSTOMER',
        customerId,
    });

    return {
        user: {
            userId: accountId,
            username,
            email,
            role: 'CUSTOMER',
            customerId,
        },
        token,
    };
};

const login = async ({
    username,
    password,
}) => {
    // 1. Find account
    const account =
        await authRepository.findAccountByUsername(username);

    if (!account) {
        throw new AppError(
            'Invalid username or password',
            401
        );
    }

    // 2. Check account status
    if (account.TrangThaiTaiKhoan !== 'ACTIVE') {
        throw new AppError(
            'Account is inactive',
            403
        );
    }

    // 3. Compare password
    const isPasswordValid =
        await comparePassword(
            password,
            account.MatKhauHash
        );

    if (!isPasswordValid) {
        throw new AppError(
            'Invalid username or password',
            401
        );
    }

    // 4. Generate JWT
    const token = generateToken({
        userId: account.MaTaiKhoan,
        role: account.TenRole,
        customerId: account.MaKhachHang,
        employeeId: account.MaNhanVien,
    });

    return {
        user: {
            userId: account.MaTaiKhoan,
            username: account.TenDangNhap,
            email: account.Email,
            role: account.TenRole,
            customerId: account.MaKhachHang,
            employeeId: account.MaNhanVien,
        },
        token,
    };
};

const getMe = async (userId) => {
    const account =
        await authRepository.findAccountById(userId);

    if (!account) {
        throw new AppError(
            'Account not found',
            404
        );
    }

    return {
        userId: account.MaTaiKhoan,
        username: account.TenDangNhap,
        email: account.Email,
        role: account.TenRole,
        customerId: account.MaKhachHang,
        employeeId: account.MaNhanVien,
        status: account.TrangThaiTaiKhoan,
    };
};

module.exports = {
    register,
    login,
    getMe,
};