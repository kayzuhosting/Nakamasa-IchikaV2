const tiktokStalk = require('../../scrape/tiktokstalk')

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('Contoh: .tiktokstalk tiktok')

  await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

  const data = await tiktokStalk(text)
  if (data.status === 'error') {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return m.reply(data.message)
  }

  const info = data.user || data.userInfo || {}
  const {
    nickname,
    uniqueId,
    signature,
    followerCount,
    followingCount,
    heartCount,
    videoCount,
    avatarLarger
  } = info

  const hasil = `
📌 *TIKTOK USER INFO*
🧑 Name: ${nickname}
🔗 Username: @${uniqueId}
📝 Bio: ${signature || '-'}
🎬 Videos: ${videoCount}
👥 Followers: ${followerCount}
👣 Following: ${followingCount}
❤️ Likes: ${heartCount}
`.trim()

  await conn.sendFile(m.chat, avatarLarger, 'profile.jpg', hasil, m)
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['tiktokstalk <username>']
handler.tags = ['stalker']
handler.command = /^tiktokstalk$/i

module.exports = handler
