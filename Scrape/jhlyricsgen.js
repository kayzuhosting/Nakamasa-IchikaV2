const axios = require('axios')

async function JHLyricsGen(prompt = '', style = 'Automatic', length = 'Long', language = 'Indonesian') {
  if (!prompt) throw new Error('Prompt is required')

  const ip = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
  const headers = {
    'Content-Type': 'application/json',
    'X-Forwarded-For': ip,
    'X-Real-IP': ip,
    'Client-IP': ip,
    'Forwarded': `for=${ip}`
  }

  try {
    const tokenRes = await axios.get('https://lyricsgenerator.io/api/token', { headers })
    const token = tokenRes.data?.data
    if (!token) throw new Error('Token not received')

    const payload = {
      style,
      length,
      theme: prompt,
      language,
      generateType: 'default'
    }

    const response = await axios.post(
      'https://lyricsgenerator.io/api/lyrics/get',
      payload,
      {
        headers: {
          ...headers,
          token
        }
      }
    )

    return response.data
  } catch (e) {
    const detail = e.response?.data || e.message
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }
}

module.exports = JHLyricsGen
