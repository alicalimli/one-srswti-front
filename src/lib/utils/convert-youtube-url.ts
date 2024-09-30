export function extractYouTubeLiveId(url: string) {
  const regex = /youtube\.com\/live\/([a-zA-Z0-9_-]+)/
  const match = url.match(regex)
  if (match && match[1]) {
    return match[1]
  } else {
    return null
  }
}

export function convertYouTubeURL(url: string) {
  if (url.includes('youtube') && url.includes('live')) {
    const id = extractYouTubeLiveId(url)
    return `https://www.youtube.com/watch?v=${id}`
  }

  if (url.includes('youtube')) {
    return url
  }

  const idMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)|(?:youtube\.com\/.*[?&]v=)([^?&]+)/
  )

  const videoId = idMatch ? idMatch[1] || idMatch[2] : null

  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`
  } else {
    return url
  }
}
