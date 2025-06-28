const request = require('request')
const cheerio = require('cheerio')

// Bypass SSL error karena situs pakai sertifikat kedaluwarsa
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

async function kodepos(kota) {
  return new Promise((resolve, reject) => {
    const postalcode = 'https://carikodepos.com/'
    const url = postalcode + '?s=' + kota

    request.get({
      headers: {
        'Accept': 'application/json, text/javascript, */*;',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0)',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Origin': postalcode,
        'Referer': postalcode
      },
      url
    }, (error, response, body) => {
      if (error) return reject(error)

      const $ = cheerio.load(body)
      const search = $('tr')
      if (!search.length) return reject('Data tidak ditemukan')

      const results = []
      search.each(function (i) {
        if (i !== 0) {
          const td = $(this).find('td')
          const result = {}
          td.each(function (i) {
            const value = $(this).find('a').html()
            const key = (i === 0) ? 'province' :
                        (i === 1) ? 'city' :
                        (i === 2) ? 'subdistrict' :
                        (i === 3) ? 'urban' : 'postalcode'
            result[key] = value
          })
          results.push(result)
        }
      })

      resolve(results)
    })
  })
}

module.exports = kodepos
