'use client'

import { useRef, useEffect } from 'react'
import { useCameraStream } from '@/components/dashboard/camera-side/hook/useCameraStream'

interface CameraStreamHandlerProps {
  camera: {
    id: string
    name: string
    url: string
    category: string
  }
  pathname: string
  onTriggerWarning: (name: string, category: string) => void
}

export default function CameraStreamHandler({ camera, pathname, onTriggerWarning }: CameraStreamHandlerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCameraStream({
    url: camera.url,
    canvasRef,
    onMetadata: () => {
      const expectedPath = `/dashboard/categories/${camera.category}`
      if (pathname !== expectedPath) {
        onTriggerWarning(camera.name, camera.category)
      }
    },
  })

  return null // אין צורך להציג את הוידאו כאן
}
