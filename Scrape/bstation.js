const axios = require('axios')
const cheerio = require('cheerio')

async function bstation(url, quality) {
  const scrapedData = {
    status: 500,
    content: false,
    result: {
      metadata: {},
      download: {}
    }
  }

  try {
    const format = ["max", "4320", "2160", "1440", "1080", "720", "480", "360", "240", "144", "320", "256", "128", "96", "64", "8"]
    if (!/www\.bilibili\.com|bili\.im/.test(url)) throw 'Masukkan link Bstation yang valid'
    if (!format.includes(quality)) throw 'Quality tidak tersedia. Contoh: ' + format.join(', ')

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const $ = cheerio.load(response.data)
    const finalurl = response.request.res.responseUrl || url

    scrapedData.status = 200
    scrapedData.content = true
    scrapedData.result.metadata = {
      title: $('title').text().trim() || null,
      locate: $('meta[property="og:locale"]').attr('content') || null,
      description: $('meta[name="description"]').attr('content') || null,
      thumbnail: $('meta[property="og:image"]').attr('content') || null,
      like: $('.interactive__btn.interactive__like .interactive__text').text() || null,
      view: $('.bstar-meta__tips-left .bstar-meta-text').first().text() || null,
      url: finalurl
    }

    const download = await axios.post("https://c.blahaj.ca/", {
      url: finalurl,
      videoQuality: quality,
      downloadMode: "auto"
    }, {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      }
    }).then(a => a.data)

    scrapedData.result.download = download || null
    return scrapedData
  } catch (e) {
    scrapedData.result.metadata = 'Msg: ' + e
    scrapedData.result.download = 'Msg: ' + e
    return scrapedData
  }
}

module.exports = bstation
