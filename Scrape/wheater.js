const axios = require('axios')

const weather = {
  api: {
    base: 'https://weatherApi.intl.xiaomi.com',
    endpoints: {
      geoCity: (lat, lon) =>
        `/wtr-v3/location/city/geo?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}`
    }
  },

  headers: {
    'user-agent': 'Postify/1.0.0',
    accept: 'application/json'
  },

  appKey: 'weather20151024',
  sign: 'zUFJoAR2ZVrDy1vF3D07',

  _contextParams: () => {
    const romVersion = 'unknown'
    const appVersion = 'unknown'
    const alpha = 'false'
    const isGlobal = 'false'
    const device = 'browser'
    const modDevice = ''
    const locale = 'en_US'

    return `&appKey=${weather.appKey}&sign=${weather.sign}` +
      `&romVersion=${encodeURIComponent(romVersion)}` +
      `&appVersion=${encodeURIComponent(appVersion)}` +
      `&alpha=${encodeURIComponent(alpha)}` +
      `&isGlobal=${encodeURIComponent(isGlobal)}` +
      `&device=${encodeURIComponent(device)}` +
      `&modDevice=${encodeURIComponent(modDevice)}` +
      `&locale=${encodeURIComponent(locale)}`
  },

  getGeoCity: async (lat, lon) => {
    const module = 'GEO_CITY'
    const input = { latitude: lat, longitude: lon }
    if (!lat || !lon) {
      return {
        success: false,
        code: 400,
        result: { module, input, error: 'Latitude ama longitude kudu diisi yak bree...' }
      }
    }

    const url = `${weather.api.base}${weather.api.endpoints.geoCity(lat, lon)}&appKey=${weather.appKey}${weather._contextParams()}`

    try {
      const { data } = await axios.get(url, { headers: weather.headers })
      return { success: true, code: 200, result: { module, input, ...data } }
    } catch (error) {
      return {
        success: false,
        code: error.response?.status || 500,
        result: {
          module,
          input,
          error: error.response?.data?.message || error.message || 'Error bree...'
        }
      }
    }
  }
}

module.exports = { getGeoCity: weather.getGeoCity }
