const axios = require('axios')

async function pinterestdl(url) {
  try {
    const response = await axios.post(
      'https://emam-pinterest-download.vercel.app/api/download',
      { url },
      {
        headers: {
          'Host': 'emam-pinterest-download.vercel.app',
          'Connection': 'keep-alive',
          'Content-Length': '34',
          'sec-ch-ua-platform': '"Android"',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Infinix X655C Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.7151.90 Mobile Safari/537.36',
          'sec-ch-ua': '"Android WebView";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'Content-Type': 'application/json',
          'sec-ch-ua-mobile': '?1',
          'Accept': '*/*',
          'Origin': 'https://emam-pinterest-download.vercel.app',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Referer': 'https://emam-pinterest-download.vercel.app/',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      }
    )

    return response.data
  } catch (err) {
    return { status: 'error', message: err.message }
  }
}

module.exports = { pinterestdl }
