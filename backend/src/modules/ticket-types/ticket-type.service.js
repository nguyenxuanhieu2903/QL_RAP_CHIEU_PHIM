const AppError = require('../../utils/error');

const ticketTypeRepository =
    require('./ticket-type.repository');

// Lấy tất cả loại vé
const getAllTicketTypes = async () => {
    return await ticketTypeRepository.findAll();
};

// Lấy loại vé theo ID
const getTicketTypeById = async (ticketTypeId) => {
    const ticketType =
        await ticketTypeRepository.findById(
            ticketTypeId
        );

    if (!ticketType) {
        throw new AppError(
            'Ticket type not found',
            404
        );
    }

    return ticketType;
};

// Tạo loại vé
const createTicketType = async ({
    tenLoaiVe,
    moTaLoaiVe,
}) => {
    return await ticketTypeRepository.create({
        tenLoaiVe,
        moTaLoaiVe,
    });
};

// Cập nhật loại vé
const updateTicketType = async (
    ticketTypeId,
    {
        tenLoaiVe,
        moTaLoaiVe,
    }
) => {
    const existingTicketType =
        await ticketTypeRepository.findById(
            ticketTypeId
        );

    if (!existingTicketType) {
        throw new AppError(
            'Ticket type not found',
            404
        );
    }

    return await ticketTypeRepository.update(
        ticketTypeId,
        {
            tenLoaiVe,
            moTaLoaiVe,
        }
    );
};

// Xóa loại vé
const deleteTicketType = async (ticketTypeId) => {
    const existingTicketType =
        await ticketTypeRepository.findById(
            ticketTypeId
        );

    if (!existingTicketType) {
        throw new AppError(
            'Ticket type not found',
            404
        );
    }

    return await ticketTypeRepository.remove(
        ticketTypeId
    );
};

module.exports = {
    getAllTicketTypes,
    getTicketTypeById,
    createTicketType,
    updateTicketType,
    deleteTicketType,
};