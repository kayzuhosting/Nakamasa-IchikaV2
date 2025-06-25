const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { tmpdir } = require('os')

const convertDuration = (ms) => {
  const m = Math.floor(ms / 60000)
  const s = ((ms % 60000) / 1000).toFixed(0)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(`🚫 Masukkan judul atau URL Spotify!\nContoh: *.${command} stay the kid laroi*`)

  m.react('🎧')

  try {
    const query = text.trim()
    const metaRes = await axios.get('https://api.plathost.net/api/spotify', {
      params: { q: query }
    })

    const meta = metaRes.data
    if (!meta.status) throw new Error(meta.msg || 'Gagal ambil metadata Spotify.')

    const dlink = meta.download?.url
    if (!dlink || !dlink.startsWith('http')) throw new Error('Gagal ambil URL download.')

    const {
      title,
      artist,
      name,
      duration,
      popularity,
      preview,
      thumbnail,
      url
    } = meta.metadata

    const caption = `🎶 *Spotify Music Result*\n\n` +
      `📌 *Title:* ${title}\n` +
      `🎤 *Artist:* ${artist}\n` +
      `🎼 *Track:* ${name}\n` +
      `🕒 *Duration:* ${duration}\n` +
      `📈 *Popularity:* ${popularity}\n` +
      `🔗 *Spotify URL:* ${url}\n` +
      `🔊 *Preview:* ${preview}`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m })

    const filename = `spotify-${Date.now()}.mp3`
    const filepath = path.join(tmpdir(), filename)
    const writer = fs.createWriteStream(filepath)

    const res = await axios({
      url: dlink,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    res.data.pipe(writer)

    writer.on('finish', async () => {
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(filepath),
        mimetype: 'audio/mp4',
        fileName: `${title}.mp3`,
        ptt: false
      }, { quoted: m })

      fs.unlinkSync(filepath)
      m.react('')
    })

    writer.on('error', (err) => {
      m.reply(`❌ Gagal menyimpan audio: ${err.message}`)
    })

  } catch (e) {
    m.reply(`❌ Terjadi kesalahan:\n${e.message}`)
    m.react('⚠️')
  }
}

handler.help = ['spotifymp3']
handler.tags = ['downloader']
handler.command = /^spotifymp3$/i

module.exports = handler
