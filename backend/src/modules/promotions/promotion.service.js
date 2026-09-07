const AppError = require('../../utils/error');

const promotionRepository =
    require('./promotion.repository');

// Lấy tất cả khuyến mãi
const getAllPromotions = async () => {
    return await promotionRepository.findAll();
};

// Lấy khuyến mãi theo ID
const getPromotionById = async (promotionId) => {
    const promotion =
        await promotionRepository.findById(
            promotionId
        );

    if (!promotion) {
        throw new AppError(
            'Promotion not found',
            404
        );
    }

    return promotion;
};

// Lấy các khuyến mãi đang hoạt động
const getActivePromotions = async () => {
    return await promotionRepository.findActive();
};

// Tạo khuyến mãi
const createPromotion = async ({
    tenKhuyenMai,
    phanTramGiam,
    ngayBatDau,
    ngayKetThuc,
}) => {
    if (new Date(ngayBatDau) > new Date(ngayKetThuc)) {
        throw new AppError(
            'Start date must be before end date',
            400
        );
    }

    return await promotionRepository.create({
        tenKhuyenMai,
        phanTramGiam,
        ngayBatDau,
        ngayKetThuc,
    });
};

// Cập nhật khuyến mãi
const updatePromotion = async (
    promotionId,
    {
        tenKhuyenMai,
        phanTramGiam,
        ngayBatDau,
        ngayKetThuc,
    }
) => {
    const existingPromotion =
        await promotionRepository.findById(
            promotionId
        );

    if (!existingPromotion) {
        throw new AppError(
            'Promotion not found',
            404
        );
    }

    if (new Date(ngayBatDau) > new Date(ngayKetThuc)) {
        throw new AppError(
            'Start date must be before end date',
            400
        );
    }

    return await promotionRepository.update(
        promotionId,
        {
            tenKhuyenMai,
            phanTramGiam,
            ngayBatDau,
            ngayKetThuc,
        }
    );
};

// Xóa khuyến mãi
const deletePromotion = async (promotionId) => {
    const existingPromotion =
        await promotionRepository.findById(
            promotionId
        );

    if (!existingPromotion) {
        throw new AppError(
            'Promotion not found',
            404
        );
    }

    return await promotionRepository.remove(
        promotionId
    );
};

module.exports = {
    getAllPromotions,
    getPromotionById,
    getActivePromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
};