const bstation = require('../../scrape/bstation')

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  await conn.sendMessage(m.chat, { react: { text: '🎥', key: m.key } })

  if (!text) return m.reply(`Example:\n${usedPrefix + command} https://www.bilibili.com/video/BV1aG4y1b7VG 720`)
  const [url, quality = '720'] = text.split(' ')

  try {
    const result = await bstation(url, quality)
    if (!result.content || !result.result.download || !result.result.download.downloadUrl)
      return m.reply('Gagal mendapatkan data atau file tidak tersedia')

    let caption = `🎬 *Bstation Downloader*\n\n`
    caption += `📌 *Title:* ${result.result.metadata.title}\n`
    caption += `🌍 *Locale:* ${result.result.metadata.locate || '-'}\n`
    caption += `📺 *Views:* ${result.result.metadata.view || '-'}\n`
    caption += `❤️ *Likes:* ${result.result.metadata.like || '-'}\n`
    caption += `🔗 *Link:* ${result.result.metadata.url}\n\n`
    caption += `📥 *Download:* ${quality}p\n`

    await conn.sendFile(m.chat, result.result.metadata.thumbnail, 'thumb.jpg', caption, m)
    await conn.sendFile(m.chat, result.result.download.downloadUrl, 'video.mp4', '', m)
  } catch (e) {
    m.reply('Terjadi kesalahan saat mengambil data\n\n' + e.message)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['bstation'].map(v => v + ' <url> [quality]')
handler.tags = ['downloader']
handler.command = /^bstation$/i
handler.premium = false
handler.limit = true

module.exports = handler
