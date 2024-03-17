const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let dataList = [];

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('article.listall-item').each((index, element) => {
            let seriesNameElement = $(element).find('.series-name');
            let seriesNameText = seriesNameElement.text().trim().split("- Tập")[0].trim().split("– Tập")[0].trim();

            if (seriesNameText.includes("Lời Nói Đùa Tập")) seriesNameText = "Lời Nói Đùa";
            else if (seriesNameText.includes("Sword Art Online")) seriesNameText = "Sword Art Online";
            else if (seriesNameText.includes("Cô gái Văn Chương") || seriesNameText.includes("Cô Gái Văn Chương")) seriesNameText = "Cô Gái Văn Chương";
            else if (seriesNameText.includes("Suzumiya Haruhi")) seriesNameText = "Suzumiya Haruhi";
            else if (seriesNameText.includes("Infinite Dendrogram")) seriesNameText = "Infinite Dendrogram";
            else if (seriesNameText.includes("Arifureta - Từ Tầm Thường Đến Bất Khả Chiến Bại")) seriesNameText = "Arifureta - Từ Tầm Thường Đến Bất Khả Chiến Bại";
            else if (seriesNameText.includes("Cop Craft - Cảnh Sát Đến Từ Hai Thế Giới")) seriesNameText = "Cop Craft - Cảnh Sát Đến Từ Hai Thế Giới";
            else if (seriesNameText.includes("Okitegami Kyoko")) seriesNameText = "Okitegami Kyoko";
            else if (seriesNameText.includes("86")) seriesNameText = "86 Eighty Six";
            else if (seriesNameText.includes("Tập Tỏ Tình")) seriesNameText = "Tập Tỏ Tình";
            else if (seriesNameText.includes("SPY ROOM - Lớp Học Điệp Viên")) seriesNameText = "SPY ROOM - Lớp Học Điệp Viên";
            else if (seriesNameText.includes("Tiệm Sách Cũ Biblia")) seriesNameText = "Tiệm Sách Cũ Biblia";
            else if (seriesNameText.includes("Văn Hào Lưu Lạc")) seriesNameText = "Văn Hào Lưu Lạc";
            else if (seriesNameText.includes("Cuộc Nổi Dậy Của Cô Nàng Mọt Sách")) seriesNameText = "Cuộc Nổi Dậy Của Cô Nàng Mọt Sách";
            else if (seriesNameText.includes("Date A Live")) seriesNameText = "Date A Live";
            else if (seriesNameText.includes("Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh")) seriesNameText = "Pháo Hoa, Ngắm Từ Dưới Hay Bên Cạnh";
            else if (seriesNameText.includes("Đứa Con Của Thời Tiết")) seriesNameText = "Đứa Con Của Thời Tiết";
            else if (seriesNameText.includes("Khi Hikaru Còn Trên Thế Gian Này")) seriesNameText = "Khi Hikaru Còn Trên Thế Gian Này";
            else if (seriesNameText.includes("Death Note")) seriesNameText = "Death Note";
            else if (seriesNameText.includes("5 Centimet Trên Giây")) seriesNameText = "5 Centimet Trên Giây";
            else if (seriesNameText.includes("Rừng Taiga")) seriesNameText = "Rừng Taiga";
            else if (seriesNameText.includes("Vì Con Gái Tôi Có Thể Đánh Bại Cả Ma Vương")) seriesNameText = "Vì Con Gái Tôi Có Thể Đánh Bại Cả Ma Vương";
            else if (seriesNameText.includes("Another")) seriesNameText = "Another";
            else if (seriesNameText.includes("Your Name")) seriesNameText = "Your Name";

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