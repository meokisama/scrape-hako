const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://ln.hako.vn/xuat-ban';
const maxPages = 84;

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
    "Lớp Học Điệp Viên": "Spy Room - Lớp Học Điệp Viên",
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
};

async function fetchPageData(page) {
    const url = `${baseUrl}?page=${page}`;
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const results = [];

        $('.listall-item').each((index, element) => {
            let seriesTitle = $(element).find('.series-title .series-name').text().trim();
            let authorName = $(element).find('.info-item:contains("Tác giả:") .info-value a').text().trim();
            const coverUrl = $(element).find('.series-cover .content.img-in-ratio').css('background-image');
            const coverUrlFormatted = coverUrl ? coverUrl.replace(/^url\(['"](.+)['"]\)$/, '$1') : '';

            // Remove the volume part from the title
            seriesTitle = seriesTitle.split(/- Tập|– Tập/)[0].trim();

            // Apply the series map exceptions
            Object.keys(seriesMap).forEach(name => seriesTitle = seriesTitle.includes(name) ? seriesMap[name] : seriesTitle)


            results.push({
                seriesTitle: seriesTitle,
                authorName: authorName,
                coverUrl: coverUrlFormatted
            });
        });

        return results;
    } catch (error) {
        console.error('Error fetching the webpage:', error);
        return [];
    }
}

async function fetchAllPages() {
    let allResults = [];
    for (let page = maxPages; page >= 1; page--) {
        const pageResults = await fetchPageData(page);
        allResults = allResults.concat(pageResults);
        console.log(`Fetched data from page ${page}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Remove duplicate series
    const uniqueResults = [];
    const titlesSet = new Set();
    for (const result of allResults) {
        if (!titlesSet.has(result.seriesTitle)) {
            titlesSet.add(result.seriesTitle);
            uniqueResults.push(result);
        }
    }

    // Group by author
    const groupedByAuthor = uniqueResults.reduce((acc, result) => {
        if (!acc[result.authorName]) {
            acc[result.authorName] = [];
        }
        acc[result.authorName].push({
            seriesTitle: result.seriesTitle,
            coverUrl: result.coverUrl
        });
        return acc;
    }, {});

    // Convert to desired format
    const formattedResults = Object.entries(groupedByAuthor)
        .map(([authorName, series], index) => ({
            id: index + 1,
            name: authorName,
            series: series
        }));

    // Sort by number of series in descending order
    formattedResults.sort((a, b) => b.series.length - a.series.length);

    return formattedResults;
}

async function saveToFile(data) {
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFile('author_output.txt', jsonStr, (err) => {
        if (err) throw err;
        console.log('Data has been saved to author_output.txt');
    });
}

(async () => {
    const allResults = await fetchAllPages();
    await saveToFile(allResults);
})();
