const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')

async function stylizeText(text) {
  const res = await fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
  const html = await res.text()
  const dom = new JSDOM(html)
  const table = dom.window.document.querySelector('table').children[0].children
  const obj = {}

  for (let tr of table) {
    const name = tr.querySelector('.aname').innerHTML
    const content = tr.children[1].textContent.replace(/^\n/, '').replace(/\n$/, '')
    obj[name + (obj[name] ? ' Reversed' : '')] = content
  }

  return obj
}

module.exports = stylizeText
