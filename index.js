const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let dataList = [];

const seriesMap = {
    "Lời Nói Đùa Tập": "Lời Nói Đùa",
    "Sword Art Online": "Sword Art Online",
    "Cô gái Văn Chương": "Cô Gái Văn Chương",
    "Cô Gái Văn Chương": "Cô Gái Văn Chương",
    "Suzumiya Haruhi": "Suzumiya Haruhi",
    "Infinite Dendrogram": "Infinite Dendrogram",
    "Arifureta": "Arifureta - Từ Tầm Thường Đến Bất Khả Chiến Bại",
    "Cop Craft": "Cop Craft - Cảnh Sát Đến Từ Hai Thế Giới",
    "Okitegami Kyoko": "Okitegami Kyoko",
    "86": "86 Eighty Six",
    "Tập Tỏ Tình": "Tập Tỏ Tình",
    "SPY ROOM - Lớp Học Điệp Viên": "SPY ROOM - Lớp Học Điệp Viên",
    "Tiệm Sách Cũ Biblia": "Tiệm Sách Cũ Biblia",
    "Văn Hào Lưu Lạc": "Văn Hào Lưu Lạc",
    "Cuộc Nổi Dậy Của Cô Nàng Mọt Sách": "Cuộc Nổi Dậy Của Cô Nàng Mọt Sách",
    "Date A Live": "Date A Live",
    "Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh": "Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh",
    "Đứa Con Của Thời Tiết": "Đứa Con Của Thời Tiết",
    "Khi Hikaru Còn Trên Thế Gian Này": "Khi Hikaru Còn Trên Thế Gian Này",
    "Death Note": "Death Note",
    "5 Centimet Trên Giây": "5 Centimet Trên Giây",
    "Rừng Taiga": "Rừng Taiga",
    "Vì Con Gái Tôi Có Thể Đánh Bại Cả Ma Vương": "Vì Con Gái Tôi Có Thể Đánh Bại Cả Ma Vương",
    "Another": "Another",
    "Your Name": "Your Name",
    "Khóa Chặt Cửa Nào Suzume": "Khóa Chặt Cửa Nào Suzume",
    "Sứ Giả Bốn Mùa": "Sứ Giả Bốn Mùa"
};

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('article.listall-item').each((index, element) => {
            let seriesNameElement = $(element).find('.series-name');
            let seriesNameText = seriesNameElement.text().trim().split("- Tập")[0].trim().split("– Tập")[0].trim();

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
        for (let i = 1; i <= 82; i++) {
            const url = `https://ln.hako.vn/xuat-ban?page=${i}`;
            await fetchData(url);
            await delay(5000);
            console.log(`Fetched data from ${url}`);
        }

        console.log("All data fetched!");
        fs.writeFile('dataList.txt', JSON.stringify(dataList), (err) => {
            if (err) throw err;
            console.log('DataList has been saved to dataList.txt');
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fetchAllData();