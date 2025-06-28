const axios = require('axios')
const cheerio = require('cheerio')

const pindl = {
  video: async (url) => {
    try {
      const { data } = await axios.get(url)
      const $ = cheerio.load(data)
      const mediaDataScript = $('script[data-test-id="video-snippet"]')

      if (mediaDataScript.length) {
        const mediaData = JSON.parse(mediaDataScript.html())

        if (mediaData["@type"] === "VideoObject" && mediaData.contentUrl?.endsWith(".mp4")) {
          return {
            type: "video",
            name: mediaData.name,
            description: mediaData.description,
            contentUrl: mediaData.contentUrl,
            thumbnailUrl: mediaData.thumbnailUrl,
            uploadDate: mediaData.uploadDate,
            duration: mediaData.duration,
            commentCount: mediaData.commentCount,
            likeCount: mediaData.interactionStatistic?.find(
              stat => stat.InteractionType["@type"] === "https://schema.org/LikeAction"
            )?.InteractionCount,
            watchCount: mediaData.interactionStatistic?.find(
              stat => stat.InteractionType["@type"] === "https://schema.org/WatchAction"
            )?.InteractionCount,
            creator: mediaData.creator?.name,
            creatorUrl: mediaData.creator?.url,
            keywords: mediaData.keywords
          }
        }
      }

      return null
    } catch {
      return { error: "Error fetching video data" }
    }
  },

  image: async (url) => {
    try {
      const { data } = await axios.get(url)
      const $ = cheerio.load(data)
      const mediaDataScript = $('script[data-test-id="leaf-snippet"]')

      if (mediaDataScript.length) {
        const mediaData = JSON.parse(mediaDataScript.html())
        if (
          mediaData["@type"] === "SocialMediaPosting" &&
          /\.(png|jpe?g|webp)$/i.test(mediaData.image) &&
          !mediaData.image.endsWith(".gif")
        ) {
          return {
            type: "image",
            author: mediaData.author?.name,
            authorUrl: mediaData.author?.url,
            headline: mediaData.headline,
            articleBody: mediaData.articleBody,
            image: mediaData.image,
            datePublished: mediaData.datePublished,
            sharedContentUrl: mediaData.sharedContent?.url,
            isRelatedTo: mediaData.isRelatedTo,
            mainEntityOfPage: mediaData.mainEntityOfPage?.["@id"]
          }
        }
      }

      return null
    } catch {
      return { error: "Error fetching image data" }
    }
  },

  gif: async (url) => {
    try {
      const { data } = await axios.get(url)
      const $ = cheerio.load(data)
      const mediaDataScript = $('script[data-test-id="leaf-snippet"]')

      if (mediaDataScript.length) {
        const mediaData = JSON.parse(mediaDataScript.html())
        if (
          mediaData["@type"] === "SocialMediaPosting" &&
          mediaData.image?.endsWith(".gif")
        ) {
          return {
            type: "gif",
            author: mediaData.author?.name,
            authorUrl: mediaData.author?.url,
            headline: mediaData.headline,
            articleBody: mediaData.articleBody,
            gif: mediaData.image,
            datePublished: mediaData.datePublished,
            sharedContentUrl: mediaData.sharedContent?.url,
            isRelatedTo: mediaData.isRelatedTo,
            mainEntityOfPage: mediaData.mainEntityOfPage?.["@id"]
          }
        }
      }

      return null
    } catch {
      return { error: "Error fetching gif data" }
    }
  },

  donlod: async (url) => {
    let result = await pindl.video(url)
    if (result) return result

    result = await pindl.image(url)
    if (result) return result

    result = await pindl.gif(url)
    return result || { error: "No media found" }
  }
}

module.exports = pindl
