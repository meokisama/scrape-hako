const baseUrl = 'https://ln.hako.vn/xuat-ban';
const maxPages = 84;

const seriesMap = {
    "Lời Nói Đùa Tập": "Lời Nói Đùa",
    "Sword Art Online 0": "Sword Art Online",
    "Sword Art Online Progressive 0": "Sword Art Online Progressive",
    "Cô gái Văn Chương": "Cô Gái Văn Chương",
    "Cô Gái Văn Chương": "Cô Gái Văn Chương",
    "Suzumiya Haruhi": "Suzumiya Haruhi",
    "Infinite Dendrogram": "Infinite Dendrogram",
    "Arifureta": "Arifureta - Từ Tầm Thường Đến Bất Khả Chiến Bại",
    "Cop Craft": "Cop Craft - Cảnh Sát Đến Từ Hai Thế Giới",
    "Okitegami Kyoko": "Okitegami Kyoko",
    "86": "86 Eighty Six",
    "Tập Tỏ Tình": "Tập Tỏ Tình",
    "Lớp Học Điệp Viên": "Spy Room - Lớp Học Điệp Viên",
    "Tiệm Sách Cũ Biblia": "Tiệm Sách Cũ Biblia",
    "Văn Hào Lưu Lạc": "Văn Hào Lưu Lạc",
    "Cuộc Nổi Dậy Của Cô Nàng Mọt Sách": "Cuộc Nổi Dậy Của Cô Nàng Mọt Sách",
    "Date A Live Encore": "Date A Live Encore",
    "Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh": "Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh",
    "Đứa Con Của Thời Tiết": "Đứa Con Của Thời Tiết",
    "Khi Hikaru Còn Trên Thế Gian Này": "Khi Hikaru Còn Trên Thế Gian Này",
    "Death Note": "Death Note",
    "Rừng Taiga": "Rừng Taiga",
    "Vì Con Gái Tôi Có Thể Đánh Bại Cả Ma Vương": "Vì Con Gái Tôi Có Thể Đánh Bại Cả Ma Vương",
    "Another (trọn bộ 2 tập)": "Another",
    "Your Name": "Your Name",
    "Khóa Chặt Cửa Nào Suzume": "Khóa Chặt Cửa Nào Suzume",
    "Sứ Giả Bốn Mùa": "Sứ Giả Bốn Mùa",
    "Ma Vương Kiến Tạo": "Ma Vương Kiến Tạo - Hầm Ngục Kiên Cố Nhất Chính Là Thành Phố Hiện Đại",
    "Grimgar": "Grimgar - Ảo Ảnh Và Tro Tàn",
    "Từ Tân Thế Giới": "Từ Tân Thế Giới",
    "Gia Tộc Thần Bí": "Gia Tộc Thần Bí",
    "Thế Giới Otomegame Thật Khắc Nghiệt Với Nhân Vật Quần Chúng": "Thế Giới Otome Game Thật Khắc Nghiệt Với Nhân Vật Quần Chúng",
    "Diệt Slime Suốt 300 Năm Tôi Level Max Lúc Nào Chẳng Hay": "Diệt Slime Suốt 300 Năm, Tôi Level Max Lúc Nào Chẳng Hay",
    "Holmes ở Kyoto": "Holmes Ở Kyoto",
    "Lũ Ngốc, Bài Thi và Linh Thú Triệu Hồi": "Lũ Ngốc, Bài Thi Và Linh Thú Triệu Hồi",
    "Liệu Có Sai Lầm Khi Tìm Kiếm Cuộc Gặp Gỡ Định Mệnh Trong Dungeon?": "Liệu Có Sai Lầm Khi Tìm Kiếm Cuộc Gặp Gỡ Định Mệnh Trong Dungeon",
    "Lá Thư Từ Tương Lai": "Orange - Lá Thư Từ Tương Lai",
    "Thằng Khờ": "Kem Đá",
    "Trình tự Kudryavka": "Kem Đá",
    "Búp Bê Đi Đường Vòng": "Kem Đá",
    "Khoảng Cách Giữa Hai Người": "Kem Đá",
    "Dù Được Ban Đôi Cánh": "Kem Đá"
};

module.exports = {
    seriesMap,
    maxPages,
    baseUrl
};