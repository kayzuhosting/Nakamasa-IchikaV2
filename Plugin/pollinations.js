const pollinations = require('../../scrape/pollinations')

const handler = async (m, { conn, text, args, command }) => {
  if (!text) return m.reply(`Contoh:
.poll chat Halo apa kabar
.poll image 1 gadis anime di taman
.poll voice Selamat datang di ArabDevs`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  if (command === 'pollchat') {
    let res = await pollinations.chat(text)
    await conn.sendMessage(m.chat, { text: res }, { quoted: m })
  }

  if (command === 'pollimage') {
    let url = await pollinations.image(text)
    await conn.sendMessage(m.chat, { image: { url }, caption: text }, { quoted: m })
  }

  if (command === 'pollvoice') {
    let audioUrl = await pollinations.voice(text)
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false
    }, { quoted: m })
  }
}

handler.help = ['pollchat', 'pollimage', 'pollvoice']
handler.tags = ['ai']
handler.command = ['pollchat', 'pollimage', 'pollvoice']
handler.limit = true
handler.register = true

module.exports = handler
