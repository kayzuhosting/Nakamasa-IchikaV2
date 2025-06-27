const JHYTPlus = require('../../scrape/jhytplus')

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} https://youtu.be/L7w9sgn81rE`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const { title, downloadURL, format } = await JHYTPlus(text)

    await conn.sendMessage(m.chat, {
      document: { url: downloadURL },
      mimetype: `audio/${format}`,
      fileName: title + '.' + format,
      caption: `🎶 *YouTube Audio*\n📌 Judul: ${title}`
    }, { quoted: m })
  } catch (e) {
    m.reply(`Gagal mengunduh audio:\n${e.message}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['ytaudio <url>']
handler.tags = ['downloader']
handler.command = /^ytaudio$/i

module.exports = handler
