const mediafireDownloader = require('../../scrape/mediafire')

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} https://www.mediafire.com/file/abcxyz/sample.zip/file`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const res = await mediafireDownloader(text)
    const { title, size, mimetype, downloadLink } = res

    await conn.sendMessage(m.chat, {
      document: { url: downloadLink },
      fileName: title,
      mimetype,
      caption: `📦 *Mediafire Downloader*\n\n📄 Nama: ${title}\n📁 Ukuran: ${size}\n📎 Tipe: ${mimetype}`
    }, { quoted: m })
  } catch (e) {
    m.reply(`Gagal mendownload:\n${e.message}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['mediafire <url>']
handler.tags = ['downloader']
handler.command = /^mediafire$/i

module.exports = handler
