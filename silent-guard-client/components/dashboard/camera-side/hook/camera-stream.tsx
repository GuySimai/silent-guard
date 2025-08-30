'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import CameraWarning from '@/components/dashboard/camera-side/camera-warning'
import CameraStreamHandler from '@/components/dashboard/camera-side/hook/camera-stream-handler'

interface Camera {
  id: string
  name: string
  url: string
  category: string
}

export default function CameraStreamerManager({ cameras }: { cameras: Camera[] }) {
  const [warning, setWarning] = useState<{ name: string; category: string } | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const pathname = usePathname()

  const handleDismiss = () => setIsDismissed(true)

  return (
    <>
      {cameras.map((camera) => (
        <CameraStreamHandler
          key={camera.id}
          camera={camera}
          pathname={pathname}
          onTriggerWarning={(name, category) => {
            setWarning({ name, category })
            setIsDismissed(false)
          }}
        />
      ))}

      {(warning && pathname !== `/dashboard/categories/${warning.category}` && !isDismissed) && (
        <CameraWarning
          cameraName={warning.name}
          categoryId={warning.category}
          onDismiss={handleDismiss}
          showAlert={true}
        />
      )}
    </>
  )
}
