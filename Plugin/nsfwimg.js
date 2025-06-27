const nsfwimage = require('../../scrape/nsfwimage')
const { writeFileSync, unlinkSync } = require('fs')
const { fromBuffer } = require('file-type')
const { spawn } = require('child_process')
const axios = require('axios')
const path = require('path')

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} 1girl, ichika from blue archive, bikini`)

  await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

  try {
    const imageUrl = await nsfwimage(text)

    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const inputBuffer = Buffer.from(res.data)
    const inputPath = `./tmp/input-${Date.now()}.webp`
    const outputPath = inputPath.replace('.webp', '.jpg')

    writeFileSync(inputPath, inputBuffer)

    // Convert ke .jpg pakai dwebp (ImageMagick/ffmpeg bisa juga)
    await new Promise((resolve, reject) => {
      const proc = spawn('dwebp', [inputPath, '-o', outputPath])
      proc.on('exit', code => code === 0 ? resolve() : reject(new Error('Konversi gagal')))
    })

    await conn.sendMessage(m.chat, {
      image: { url: path.resolve(outputPath) },
      caption: `🖼️ *NSFW Image Generator*\n\nPrompt:\n${text}`
    }, { quoted: m })

    unlinkSync(inputPath)
    unlinkSync(outputPath)
  } catch (e) {
    m.reply(`Gagal generate:\n${e.message}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
}

handler.help = ['nsfwimg <prompt>']
handler.tags = ['nsfw']
handler.command = /^nsfwimg$/i

module.exports = handler
