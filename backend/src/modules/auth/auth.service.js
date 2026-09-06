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
    const existingAccount =
        await authRepository.findAccountByUsername(username);

    if (existingAccount) {
        throw new AppError(
            'Username already exists',
            409
        );
    }

    const existingCustomer =
        await authRepository.findCustomerByEmail(email);

    if (existingCustomer) {
        throw new AppError(
            'Email already exists',
            409
        );
    }

    const passwordHash =
        await hashPassword(password);

    const customerId =
        await authRepository.createCustomer({
            fullName,
            phone,
            email,
        });

    const accountId =
        await authRepository.createAccount({
            username,
            passwordHash,
            email,
            roleId: 1,
            customerId,
        });

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
    const account =
        await authRepository.findAccountByUsername(username);

    if (!account) {
        throw new AppError(
            'Invalid username or password',
            401
        );
    }

    if (!account.TrangThaiTaiKhoan) {
        throw new AppError(
            'Account is inactive',
            403
        );
    }

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

    const token = generateToken({
        userId: account.MaTaiKhoan_PK,
        role: account.TenRole,
        customerId: account.MaKhachHang_FK,
        employeeId: account.MaNhanVien_FK,
    });

    return {
        user: {
            userId: account.MaTaiKhoan_PK,
            username: account.TenDangNhap,
            email: account.Email,
            role: account.TenRole,
            customerId: account.MaKhachHang_FK,
            employeeId: account.MaNhanVien_FK,
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
        userId: account.MaTaiKhoan_PK,
        username: account.TenDangNhap,
        email: account.Email,
        role: account.TenRole,
        customerId: account.MaKhachHang_FK,
        employeeId: account.MaNhanVien_FK,
        status: account.TrangThaiTaiKhoan,
    };
};

module.exports = {
    register,
    login,
    getMe,
};