'use client'

import { useRef, useEffect } from 'react'
import { useCameraStream } from '@/components/dashboard/camera-side/hook/useCameraStream'
import { AlertTriangle, X, Maximize, Minimize, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { handleDeleteCamera } from '@/server/actions/deleteCamera'

interface Camera {
  id: string
  name: string
  url: string
  category: string
}

interface Props {
  camera: Camera
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onDanger: () => void
  showAlert: boolean
  dismissAlert: () => void
}

export default function CameraCard({
  camera,
  isFullscreen,
  onToggleFullscreen,
  onDanger,
  showAlert,
  dismissAlert,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useCameraStream({
    url: camera.url,
    canvasRef,
    onMetadata: () => {
      onDanger()
    },
  })

  useEffect(() => {
    if (audioRef.current) {
      if (showAlert) {
        console.log('pita')
        audioRef.current.play().catch((err) => {
          console.error('Audio playback failed:', err)
        })
      } else {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [showAlert])

  return (
    <div
      className={`relative border rounded overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-black'
          : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
      <audio ref={audioRef} src="/alarm-sound.mp3" loop />

      <div className="absolute top-2 left-2 flex items-center justify-between w-full px-2 z-10">
        <div className="bg-black/50 text-white text-sm px-2 py-1 rounded">
          {camera.name}
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button onClick={onToggleFullscreen} variant="default">
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:text-red-600"
            onClick={async () => {
              await handleDeleteCamera(camera.id)
              window.location.href = '/dashboard'
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showAlert && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white p-2 animate-pulse flex items-center gap-2 z-10">
          <AlertTriangle className="h-5 w-5" />
          Danger!
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissAlert}
            className="ml-auto text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
