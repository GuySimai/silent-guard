'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import Link from 'next/link'

interface CameraWarningProps {
  cameraName: string
  categoryId: string
  onDismiss?: () => void
  showAlert: boolean
}

export default function CameraWarning({ cameraName, categoryId, onDismiss, showAlert }: CameraWarningProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (showAlert) {
        audioRef.current.play().catch((err) => {
          console.error('Audio playback failed:', err)
        })
      } else {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [showAlert])

  const stopAudioAndDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    onDismiss?.()
  }

  if (!showAlert) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-200 border-l-4 border-yellow-600 text-yellow-900 p-4 rounded shadow-lg w-[90%] max-w-md animate-pulse">
      <audio ref={audioRef} src="/alarm-sound.mp3" loop />
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6" />
        <div className="flex-1">
          <p className="font-bold">Potential Drowning Detected</p>
          <p>
            Camera <span className="font-semibold">{cameraName}</span> triggered an alert
            in another category.{' '}
            <Link
              href={`/dashboard/categories/${categoryId}`}
              className="underline font-medium text-blue-800"
              onClick={stopAudioAndDismiss}
            >
              View Category
            </Link>
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={stopAudioAndDismiss}
            className="text-yellow-900 hover:text-yellow-700 transition-colors"
            aria-label="Dismiss warning"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
