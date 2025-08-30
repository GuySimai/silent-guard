'use client'

import { useState } from 'react'
import CameraCard from './camera-card'
import { AlertTriangle } from 'lucide-react'

interface Camera {
  id: string
  name: string
  url: string
  category: string
}

interface Props {
  cameras: Camera[]
  currentCategory: string
}

export default function CameraGrid({ cameras, currentCategory }: Props) {
  const [fullscreenCameraId, setFullscreenCameraId] = useState<string | null>(null)
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({})
  const [externalAlert, setExternalAlert] = useState<{
    cameraName: string
    category: string
  } | null>(null)

  const handleDanger = (camera: Camera) => {
    setActiveAlerts(prev => ({ ...prev, [camera.id]: true }))

    if (camera.category !== currentCategory) {
      setExternalAlert({
        cameraName: camera.name,
        category: camera.category,
      })
    }
  }

  const dismissAlert = (cameraId: string) => {
    setActiveAlerts(prev => ({ ...prev, [cameraId]: false }))
    setExternalAlert(null)
  }

  const getGridCols = () => {
    if (fullscreenCameraId) return 'grid-cols-1'

    const count = cameras.length
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2'
    if (count <= 4) return 'grid-cols-2 md:grid-cols-2'
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3'
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }

  return (
    <div className="relative h-full bg-gray-100 p-20">
      {externalAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-300 text-black p-3 rounded shadow flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          Danger in camera "{externalAlert.cameraName}" (category: "{externalAlert.category}")
        </div>
      )}

      <div className={`grid gap-4 h-full w-full ${getGridCols()}`}>
        {cameras.map(camera => {
          const isVisible = !fullscreenCameraId || fullscreenCameraId === camera.id

          return (
            isVisible && (
              <CameraCard
                key={camera.id}
                camera={camera}
                isFullscreen={fullscreenCameraId === camera.id}
                onToggleFullscreen={() =>
                  setFullscreenCameraId(prev =>
                    prev === camera.id ? null : camera.id
                  )
                }
                onDanger={() => handleDanger(camera)}
                showAlert={!!activeAlerts[camera.id]}
                dismissAlert={() => dismissAlert(camera.id)}
              />
            )
          )
        })}
      </div>
    </div>
  )
}
