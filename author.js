const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require("path");
const { seriesMap, maxPages, baseUrl } = require('./config');

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
            seriesTitle = seriesTitle.split(/- Tập|-  Tập|– Tập|\(Tập/)[0].trim();

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
    fs.writeFile(path.join(__dirname, 'output') + '/author_output.txt', jsonStr, (err) => {
        if (err) throw err;
        console.log('Data has been saved to author_output.txt');
    });
}

(async () => {
    const allResults = await fetchAllPages();
    await saveToFile(allResults);
})();
