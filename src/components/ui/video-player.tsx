
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  src: string
  className?: string
}

function VideoPlayer({ src, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const video = videoRef?.current

    if (!video) return

    let playPromise: Promise<void> | undefined

    const playVideo = () => {
      if (video.paused) {
        playPromise = video.play()
        if (playPromise) {
          playPromise.catch((error: any) => {
            console.error('Error attempting to play video:', error)
          })
        }
      }
    }

    const pauseVideo = () => {
      if (playPromise) {
        playPromise
          .then(() => {
            video.pause()
          })
          .catch((error: any) => {
            console.error('Error pausing video:', error)
          })
      } else {
        video.pause()
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting)
          if (entry.isIntersecting && !document.hidden) {
            playVideo()
          } else {
            pauseVideo()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo()
      } else if (isVisible) {
        playVideo()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer.unobserve(video)
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isVisible])

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="false"
      className={cn('object-cover w-full h-full', className)}
      src={src}
    />
  )
}

export default VideoPlayer
