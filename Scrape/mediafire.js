const axios = require('axios')
const cheerio = require('cheerio')
const mime = require('mime-types')

function formatSize(bytes) {
  const kb = bytes / 1024
  const mb = kb / 1024
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`
}

async function mediafireDownloader(url) {
  if (!url.includes('mediafire.com')) throw new Error('URL bukan Mediafire')

  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })

  const $ = cheerio.load(data)
  const dl = $('#downloadButton').attr('href')
  if (!dl) throw new Error('Gagal ambil link download')

  let title = $('div.download_file_title > h1').text().trim() || decodeURIComponent(url.split('/').slice(-2, -1)[0])
  title = title.replace(/\+/g, ' ')
  const type = title.split('.').pop()

  let size = ''
  try {
    const head = await axios.head(dl)
    const length = parseInt(head.headers['content-length'])
    size = formatSize(length)
  } catch {}

  return {
    title,
    size,
    type,
    mimetype: mime.lookup(title) || 'application/octet-stream',
    downloadLink: dl
  }
}

module.exports = mediafireDownloader
