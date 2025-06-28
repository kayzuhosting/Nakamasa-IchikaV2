const pindl = require('../../scrape/pindl')

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} https://pin.it/xxxxxx`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const res = await pindl.donlod(text)
    if (res?.error) throw res.error

    let caption = `📌 *Pinterest Media*\n`
    if (res.type === 'video') {
      caption += `🎞 *Type:* Video\n🎬 *Title:* ${res.name}\n📅 *Uploaded:* ${res.uploadDate}`
      await conn.sendFile(m.chat, res.contentUrl, 'video.mp4', caption, m)
    } else if (res.type === 'image') {
      caption += `🖼 *Type:* Image\n📝 *Headline:* ${res.headline}`
      await conn.sendFile(m.chat, res.image, 'image.jpg', caption, m)
    } else if (res.type === 'gif') {
      caption += `🎞 *Type:* GIF\n📝 *Headline:* ${res.headline}`
      await conn.sendFile(m.chat, res.gif, 'image.gif', caption, m)
    } else {
      throw 'Media tidak ditemukan atau link salah'
    }
  } catch (e) {
    m.reply(`Gagal mengambil media\n\n${e}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.command = ['pindl', 'pinmedia']
handler.help = ['pindl <url>']
handler.tags = ['downloader']
handler.limit = true

module.exports = handler
