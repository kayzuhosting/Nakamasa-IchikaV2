const stylizeText = require('../../scrape/stylize')

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} Ichika Bot`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const data = await stylizeText(text)
    const formatted = Object.entries(data).map(([name, style]) => `*${name}*\n${style}`).join('\n\n')

    await m.reply(`✨ *Hasil Stylize dari:* _${text}_\n\n${formatted}`)
  } catch (e) {
    m.reply('Gagal mengambil gaya teks')
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['stylize'].map(v => v + ' <teks>')
handler.tags = ['tools']
handler.command = /^stylize$/i

module.exports = handler
