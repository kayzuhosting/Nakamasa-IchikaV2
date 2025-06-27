const nikParse = require('../../scrape/nikparse')

const handler = async (m, { conn, args }) => {
  const react = '🪪'
  await conn.sendMessage(m.chat, { react: { text: react, key: m.key } })

  if (!args[0]) return m.reply('Masukkan NIK yang valid!\nContoh: *.nikparse 1410051604080001*')
  try {
    const res = await nikParse(args[0])
    const teks = `
📄 *Informasi NIK*
🆔 *NIK:* ${res.nik}
🧍 *Jenis Kelamin:* ${res.kelamin}
🎂 *Tanggal Lahir:* ${res.lahir_lengkap}
🧮 *Usia:* ${res.tambahan.usia} (${res.tambahan.kategori_usia})
🎉 *Ulang Tahun:* ${res.tambahan.ultah}
🔮 *Zodiak:* ${res.tambahan.zodiak}
📆 *Hari Lahir:* ${res.tambahan.pasaran}

🌍 *Wilayah*
📍 *Provinsi:* ${res.provinsi.nama}
🏙️ *${res.kotakab.jenis}:* ${res.kotakab.nama}
🏘️ *Kecamatan:* ${res.kecamatan.nama}
🔢 *Kode Wilayah:* ${res.kode_wilayah}
🔖 *Nomor Urut:* ${res.nomor_urut}
    `.trim()

    await m.reply(teks)
  } catch (e) {
    m.reply(`❌ ${e.message}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['nikparse <nik>']
handler.tags = ['tools']
handler.command = /^nikparse$/i
handler.limit = true
handler.register = true

module.exports = handler
