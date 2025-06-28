const kodepos = require('../../scrape/kodepos')

const handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} merbau`)

  try {
    await conn.sendMessage(m.chat, { react: { text: '📮', key: m.key } })

    const data = await kodepos(text)
    let hasil = `📌 *Hasil Pencarian Kode Pos untuk "${text}"*\n\n`

    hasil += data.slice(0, 10).map((v, i) => `
${i + 1}.
• Provinsi: ${v.province}
• Kota/Kabupaten: ${v.city}
• Kecamatan: ${v.subdistrict}
• Kelurahan/Desa: ${v.urban}
• Kode Pos: *${v.postalcode}*
    `.trim()).join('\n\n')

    m.reply(hasil)
  } catch (err) {
    m.reply('❌ Gagal mengambil data atau tidak ditemukan!')
  }
}

handler.help = ['kodepos <nama daerah>']
handler.tags = ['tools']
handler.command = /^kodepos$/i

module.exports = handler
