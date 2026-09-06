const { z } = require('zod');

const movieSchema = z.object({
    MaPhim: z.number({ required_error: 'Mã phim là bắt buộc' }),
    TenPhim: z.string().min(1, 'Tên phim không được để trống'),
    TheLoai: z.string().min(1, 'Thể loại không được để trống'),
    ThoiLuong: z.number().positive('Thời lượng phải lớn hơn 0'),
    TrangThaiPhim: z.string().min(1, 'Trạng thái phim không được để trống'),
    NgayKhoiChieu: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày khởi chiếu định dạng YYYY-MM-DD'),
    NgayKetThuc: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày kết thúc định dạng YYYY-MM-DD').optional().nullable(),
    MoTaPhim: z.string().optional().nullable(),
    DaoDien: z.string().optional().nullable(),
    DoTuoi: z.number().nonnegative('Độ tuổi không được âm')
});

module.exports = {
    movieSchema
};