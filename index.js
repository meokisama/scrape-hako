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