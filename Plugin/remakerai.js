const remakerai = require('../../scrape/remakerai')

const handler = async (m, { conn, args, command }) => {
  const react = '🌸'
  await conn.sendMessage(m.chat, { react: { text: react, key: m.key } })

  // Tampilkan daftar style/rasio jika user kirim: .remakerai list
  if ((args[0] || '').toLowerCase() === 'list') {
    return m.reply(
`🎨 *Daftar Style yang Tersedia:*
- ghibli1
- ghibli2
- ghibli3
- anime

📐 *Daftar Rasio Gambar:*
- 1:1
- 2:3
- 3:2
- 9:16
- 16:9

Contoh penggunaan:
.remakerai 1 girl Ichika|anime|16:9`)
  }

  if (!args[0]) return m.reply(`Contoh penggunaan:\n.remakerai Ichika Blue Archive|anime|16:9`)

  const input = args.join(' ').split('|')
  const [prompt, style = 'anime', ratio = '1:1'] = input.map(i => i.trim())

  try {
    const url = await remakerai(prompt, ratio, style)
    await conn.sendFile(m.chat, url, 'remaker.jpg', `✅ *Remaker.AI*\n📸 Prompt: ${prompt}\n🎨 Style: ${style}\n📐 Rasio: ${ratio}`, m)
  } catch (e) {
    m.reply('❌ Gagal membuat gambar: ' + e.message)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['remakerai']
handler.tags = ['ai']
handler.command = /^remakerai$/i
handler.limit = true
handler.register = true

module.exports = handler
