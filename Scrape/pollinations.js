const axios = require('axios')

const pollinations = {
  api: {
    chat: 'https://text.pollinations.ai',
    image: 'https://image.pollinations.ai/prompt',
    voice: 'https://text.pollinations.ai'
  },

  header: {
    'Connection': 'keep-alive',
    'sec-ch-ua-platform': '"Android"',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="136", "Android WebView";v="136", "Not.A/Brand";v="99"',
    'sec-ch-ua-mobile': '?1',
    'Accept': '*/*',
    'Origin': 'https://freeai.aihub.ren',
    'X-Requested-With': 'mark.via.gp',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://freeai.aihub.ren/',
    'Accept-Language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7'
  },

  models: {
    chat: [
      { name: 'openai', type: 'chat' },
      { name: 'llama', type: 'chat' },
      { name: 'mistral', type: 'chat' }
    ],
    image: [
      { name: 'Flux-anime', type: 'image' },
      { name: 'Flux-realism', type: 'image' }
    ],
    voice: [
      { name: 'Nova', value: 'nova' },
      { name: 'Echo', value: 'echo' },
      { name: 'Shimmer', value: 'shimmer' }
    ]
  },

  chat: async (question, modelIndex = 0) => {
    const model = pollinations.models.chat[modelIndex]?.name || 'openai'
    try {
      const res = await axios.get(`${pollinations.api.chat}/${encodeURIComponent(question)}`, {
        params: { model },
        headers: pollinations.header
      })
      return res.data
    } catch (e) {
      return e.message
    }
  },

  image: async (prompt, modelIndex = 0, option = {}) => {
    const model = pollinations.models.image[modelIndex]?.name || 'Flux-anime'
    const seed = option.seed ?? Math.floor(Math.random() * 999999)
    const width = option.width || '768'
    const height = option.height || '1024'
    const negative_prompt = option.negative_prompt || 'worst quality, blurry'
    const safe = option.safe ?? false

    const url = `${pollinations.api.image}/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true&safe=${safe}&negative_prompt=${encodeURIComponent(negative_prompt)}`
    return url
  },

  voice: async (text, modelIndex = 0) => {
    const voice = pollinations.models.voice[modelIndex]?.value || 'nova'
    return `${pollinations.api.voice}/${encodeURIComponent(text)}?model=openai-audio&voice=${voice}`
  }
}

module.exports = pollinations
