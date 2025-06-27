const fetch = require("node-fetch")

async function askPhind(chat, options = {}) {
  const endpoint = "https://https.extension.phind.com/agent/"

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "",
    Accept: "*/*",
    "Accept-Encoding": "identity"
  }

  const body = {
    additional_extension_context: "",
    allow_magic_buttons: true,
    is_vscode_extension: true,
    message_history: [
      ...(options.previousMessages || []),
      { content: chat, role: "user" }
    ],
    requested_model: options.model || "Phind-70B",
    user_input: chat
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error(`Request failed: ${response.status}`)

    const rawText = await response.text()
    const lines = rawText.split('\n')
    let fullText = ""

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const jsonStr = line.slice(6)
      if (jsonStr === "[DONE]") continue
      try {
        const parsed = JSON.parse(jsonStr)
        const delta = parsed?.choices?.[0]?.delta?.content
        if (delta) fullText += delta
      } catch {}
    }

    return fullText
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = askPhind
