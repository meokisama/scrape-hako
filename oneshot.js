const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require("path");
const { maxPages, baseUrl } = require('./config');

let dataList = [];
const excludeStrings = ["- Tập", "-  Tập", "– Tập", "(Tập"];
const exception = [
    "Lời Nói Đùa",
    "Sword Art Online",
    "Cô gái Văn Chương",
    "Cô Gái Văn Chương",
    "Suzumiya Haruhi",
    "Infinite Dendrogram",
    "Arifureta",
    "Cop Craft",
    "Okitegami Kyoko",
    "86",
    "Tập Tỏ Tình",
    "Lớp Học Điệp Viên",
    "Tiệm Sách Cũ Biblia",
    "Văn Hào Lưu Lạc",
    "Cuộc Nổi Dậy Của Cô Nàng Mọt Sách",
    "Date A Live",
    "Khi Hikaru Còn Trên Thế Gian Này",
    "Rừng Taiga",
    "Vì Con Gái Tôi Có Thể Đánh Bại Cả Ma Vương",
    "Khóa Chặt Cửa Nào Suzume (Bản Đặc Biệt)",
    "Sứ Giả Bốn Mùa",
    "Ma Vương Kiến Tạo",
    "Grimgar",
    "Từ Tân Thế Giới",
    "Gia Tộc Thần Bí",
    "Thế Giới Otomegame Thật Khắc Nghiệt Với Nhân Vật Quần Chúng",
    "Diệt Slime Suốt 300 Năm Tôi Level Max Lúc Nào Chẳng Hay",
    "Holmes ở Kyoto",
    "Lũ Ngốc, Bài Thi và Linh Thú Triệu Hồi",
    "Liệu Có Sai Lầm Khi Tìm Kiếm Cuộc Gặp Gỡ Định Mệnh Trong Dungeon?",
    "Lá Thư Từ Tương Lai",
    "Kem Đá",
    "Thằng Khờ",
    "Trình tự Kudryavka",
    "Búp Bê Đi Đường Vòng",
    "Khoảng Cách Giữa Hai Người",
    "Dù Được Ban Đôi Cánh",
    "Bị Đuổi Khỏi Nhóm Anh Hùng, Tôi Muốn Sống Tự Do Tự Tại Ở Vương Đô"
];

const seriesMap = {
    "Your Name": "Your Name",
    "Đứa Con Của Thời Tiết": "Đứa Con Của Thời Tiết",
    "Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh": "Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh",
    "Death Note": "Death Note - Another Note",
    "Another (trọn bộ 2 tập)": "Another",
}

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('article.listall-item').each((index, element) => {
            let seriesNameElement = $(element).find('.series-name');
            let seriesNameText = seriesNameElement.text().trim();

            if (
                excludeStrings.some(str => seriesNameText.includes(str)) ||
                exception.some(str => seriesNameText.includes(str))
            ) {
                return;
            }

            Object.keys(seriesMap).forEach(name => seriesNameText = seriesNameText.includes(name) ? seriesMap[name] : seriesNameText)

            let publisherName = $(element).find('.publisher-name a').text().trim();
            let backgroundImageUrl = $(element).find('.content.img-in-ratio').css('background-image');
            backgroundImageUrl = backgroundImageUrl.replace("url('", "").replace("')", "");

            if (!dataList.find(item => item.seriesName === seriesNameText)) {
                dataList.push({
                    seriesName: seriesNameText,
                    publisherName: publisherName,
                    coverUrl: backgroundImageUrl
                });
            }
        });
    } catch (error) {
        console.error('Error fetching data from', url, ':', error);
    }
}

async function fetchAllData() {
    try {
        const resolvedMaxPages = await maxPages;

        for (let page = resolvedMaxPages; page >= 1; page--) {
            const url = `${baseUrl}?page=${page}`;
            await fetchData(url);
            await delay(5000);
            console.log(`Fetched data from ${url}`);
        }

        // Add IDs and reverse the list
        dataList = dataList.map((item, index) => ({
            id: index + 1,
            ...item
        })).reverse();

        console.log("All data fetched!");

        const outputDir = path.join(__dirname, 'output');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFile(path.join(outputDir, 'oneshot_output.txt'), JSON.stringify(dataList, null, 2), (err) => {
            if (err) throw err;
            console.log('DataList has been saved to oneshot_output.txt');
        });


    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fetchAllData();