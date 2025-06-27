const axios = require('axios')

async function JHYTPlus(url = '') {
  const format = 'mp3' // ubah ke 'mp4' kalau ingin video
  const id = (url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/) || [])[1]
  if (!id) throw new Error('Invalid YouTube URL')

  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const headers = {
    referer: 'https://id.ytmp3.plus/'
  }

  try {
    const init = await axios.get('https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=' + Math.random(), { headers })
    const convertURL = init.data?.convertURL
    if (!convertURL) throw new Error('convertURL not found')

    const convert = await axios.get(`${convertURL}&v=${id}&f=${format}&_=` + Math.random(), { headers })
    const { downloadURL, progressURL } = convert.data
    if (!downloadURL) throw new Error('downloadURL not found')

    for (let i = 0; i < 10; i++) {
      try {
        const res = await axios.get(downloadURL, {
          headers,
          responseType: 'stream',
          maxContentLength: 1
        })
        if (res.status === 200) break
      } catch {}
      await sleep(3000)
    }

    const meta = await axios.get(progressURL, { headers })
    return {
      title: meta.data?.title || 'unknown',
      format,
      downloadURL
    }
  } catch (e) {
    const err = e.response?.data || e.message
    throw new Error(typeof err === 'string' ? err : JSON.stringify(err))
  }
}

module.exports = JHYTPlus
