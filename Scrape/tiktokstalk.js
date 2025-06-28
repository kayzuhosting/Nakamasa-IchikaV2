const fetch = require('node-fetch')
const cheerio = require('cheerio')

async function tiktokStalk(username) {
  try {
    const response = await fetch(`https://tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'PostmanRuntime/7.32.2'
      }
    })

    const html = await response.text()
    const $ = cheerio.load(html)
    const data = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text()
    const parsed = JSON.parse(data)

    const scope = parsed?.__DEFAULT_SCOPE__?.['webapp.user-detail']
    if (!scope || scope.statusCode !== 0) {
      return { status: 'error', message: 'User not found!' }
    }

    return scope.userInfo
  } catch (err) {
    return { status: 'error', message: String(err) }
  }
}

module.exports = tiktokStalk
