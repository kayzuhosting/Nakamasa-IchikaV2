const JHLyricsGen = require('../../scrape/jhlyricsgen')

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} tentang rindu dan kesedihan`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const data = await JHLyricsGen(text)
    const caption = `🎤 *Lirik Otomatis*\n\n📌 *Tema:* ${text}\n🎶 *Gaya:* ${data?.style || 'Unknown'}\n📏 *Panjang:* ${data?.length || 'Unknown'}\n🌍 *Bahasa:* ${data?.language || 'Unknown'}\n\n${data?.lyrics || 'Tidak ada hasil'}`

    await m.reply(caption)
  } catch (e) {
    m.reply(`Gagal generate lirik:\n${e.message}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['lyricsgen <tema lirik>']
handler.tags = ['ai']
handler.command = /^lyricsgen$/i

module.exports = handler
