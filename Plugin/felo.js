const felosearch = require('../../scrape/felo')

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} apa itu javascript`)
  
  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const result = await felosearch(text)
    await conn.sendMessage(m.chat, {
      text: `*📎 Hasil Pencarian Felo*\n\n${result}`
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: '❌ Gagal mengambil hasil pencarian'
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['felo'].map(v => v + ' <query>')
handler.tags = ['ai']
handler.command = /^felo$/i

module.exports = handler
