const askPhind = require('../../scrape/phind')

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} apa itu Phind?`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const res = await askPhind(text)
    await m.reply(res)
  } catch (err) {
    m.reply('Gagal mengambil jawaban dari Phind:\n' + err.message)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['phind <pertanyaan>']
handler.tags = ['ai']
handler.command = /^phind$/i

module.exports = handler
