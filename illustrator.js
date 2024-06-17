const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require("path");
const { seriesMap, maxPages, baseUrl } = require('./config');

const artistMap = {
    "Booota": "booota",
    "Tsurusaki Takahiro, Fumi": "Fuumi",
    "Momoko": "Momoco",
}

async function fetchPageData(page) {
    const url = `${baseUrl}?page=${page}`;
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const results = [];

        $('.listall-item').each((index, element) => {
            let seriesTitle = $(element).find('.series-title .series-name').text().trim();
            let artistName = $(element).find('.info-item:contains("Họa sĩ:") .info-value a').text().trim();
            const coverUrl = $(element).find('.series-cover .content.img-in-ratio').css('background-image');
            const coverUrlFormatted = coverUrl ? coverUrl.replace(/^url\(['"](.+)['"]\)$/, '$1') : '';

            // Remove the volume part from the title
            seriesTitle = seriesTitle.split(/- Tập|– Tập/)[0].trim();

            // Apply the series map exceptions
            Object.keys(seriesMap).forEach(name => seriesTitle = seriesTitle.includes(name) ? seriesMap[name] : seriesTitle)

            // Apply the artist map exceptions
            Object.keys(artistMap).forEach(name => artistName = artistName.includes(name) ? artistMap[name] : artistName)


            results.push({
                seriesTitle: seriesTitle,
                artistName: artistName,
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

    // Group by artist
    const groupedByArtist = uniqueResults.reduce((acc, result) => {
        if (!acc[result.artistName]) {
            acc[result.artistName] = [];
        }
        acc[result.artistName].push({
            seriesTitle: result.seriesTitle,
            coverUrl: result.coverUrl
        });
        return acc;
    }, {});

    // Convert to desired format
    const formattedResults = Object.entries(groupedByArtist)
        .filter(([artistName]) => artistName !== "N/A" && artistName !== "Chưa rõ")
        .map(([artistName, series], index) => ({
            id: index + 1,
            name: artistName,
            series: series
        }));

    // Sort by number of series in descending order
    // formattedResults.sort((a, b) => b.series.length - a.series.length);

    return formattedResults;
}

async function saveToFile(data) {
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFile(path.join(__dirname, 'output') + '/illustrator_output.txt', jsonStr, (err) => {
        if (err) throw err;
        console.log('Data has been saved to illustrator_output.txt');
    });
}

(async () => {
    const allResults = await fetchAllPages();
    await saveToFile(allResults);
})();
