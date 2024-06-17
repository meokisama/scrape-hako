const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require("path");
const { seriesMap, maxPages, baseUrl } = require('./config');

let dataList = [];

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
        for (let page = maxPages; page >= 1; page--) {
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
        fs.writeFile(path.join(__dirname, 'output') + '/ranobe_output.txt', JSON.stringify(dataList, null, 2), (err) => {
            if (err) throw err;
            console.log('DataList has been saved to ranobe_output.txt');
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fetchAllData();