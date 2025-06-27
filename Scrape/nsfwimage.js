const axios = require('axios')
const { default: HttpsProxyAgent } = require('https-proxy-agent')

async function nsfwimage(prompt, options = {}) {
  const {
    negative_prompt = 'lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, bad score, average score, signature, watermark, username, blurry',
    style = 'anime',
    width = 1024,
    height = 1024,
    guidance_scale = 7,
    inference_steps = 28
  } = options

  const _style = ['anime', 'real', 'photo']

  if (!prompt) throw new Error('Prompt wajib diisi')
  if (!_style.includes(style)) throw new Error(`Style harus salah satu dari: ${_style.join(', ')}`)
  if (width < 256 || width > 1216) throw new Error('Width minimal 256 dan maksimal 1216')
  if (height < 256 || height > 1216) throw new Error('Height minimal 256 dan maksimal 1216')
  if (guidance_scale < 0 || guidance_scale > 20) throw new Error('Guidance scale antara 0-20')
  if (inference_steps < 1 || inference_steps > 28) throw new Error('Inference steps maksimal 28')

  const proxyUrl = process.env.PROXY || ''
  const axiosInstance = axios.create(
    proxyUrl
      ? { proxy: false, httpsAgent: new HttpsProxyAgent(proxyUrl) }
      : {}
  )

  const session_hash = Math.random().toString(36).substring(2)
  const base = `https://heartsync-nsfw-uncensored${style !== 'anime' ? `-${style}` : ''}.hf.space`

  await axiosInstance.post(`${base}/gradio_api/queue/join?`, {
    data: [
      prompt,
      negative_prompt,
      0,
      true,
      width,
      height,
      guidance_scale,
      inference_steps
    ],
    event_data: null,
    fn_index: 2,
    trigger_id: 16,
    session_hash
  })

  const res = await axiosInstance.get(`${base}/gradio_api/queue/data?session_hash=${session_hash}`)
  const lines = res.data.split('\n\n')

  let result
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const json = JSON.parse(line.substring(6))
      if (json.msg === 'process_completed') result = json.output.data[0].url
    }
  }

  if (!result) throw new Error('Gagal mendapatkan URL gambar')

  return result
}

module.exports = nsfwimage
