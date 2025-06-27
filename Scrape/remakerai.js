const axios = require('axios')
const FormData = require('form-data')

async function remakerai(prompt, rasioo = '1:1', stylee = 'anime') {
  const rasio = ['1:1', '2:3', '9:16', '3:2', '16:9']
  const style = ['ghibli1', 'ghibli2', 'ghibli3', 'anime']

  if (!rasio.includes(rasioo)) throw new Error('Rasio tidak valid.')
  if (!style.includes(stylee)) throw new Error('Style tidak valid.')

  const form = new FormData()
  form.append('prompt', prompt)
  form.append('style', stylee)
  form.append('aspect_ratio', rasioo)

  const headers = {
    ...form.getHeaders(),
    accept: '*/*',
    'accept-language': 'id-ID,id;q=0.9',
    authorization: '',
    origin: 'https://remaker.ai',
    priority: 'u=1, i',
    'product-code': '067003',
    'product-serial': 'c25cb430662409bdea35c95eceaffa1f',
    referer: 'https://remaker.ai/',
    'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
  }

  const res = await axios.post(
    'https://api.remaker.ai/api/pai/v4/ai-anime/create-job',
    form,
    { headers }
  )

  const job_id = res.data.result.job_id

  for (let i = 0; i < 20; i++) {
    const check = await axios.get(
      `https://api.remaker.ai/api/pai/v4/ai-anime/get-job/${job_id}`,
      { headers }
    )

    const output = check.data.result?.output
    if (output && output.length > 0) return output[0]

    await new Promise(res => setTimeout(res, 2000))
  }

  throw new Error('Gagal mendapatkan hasil')
}

module.exports = remakerai
