'use client'

import { useEffect, useRef } from 'react'
import {
  createMetadataEmitter,
  startMetadataStream,
  MetadataStatus,
} from '@/lib/camera-connection'

// Create global maps to track streams and their active canvases
const streamEmitters = new Map<string, ReturnType<typeof createMetadataEmitter>>()
const streamFrames = new Map<string, Blob | null>()
const activeCanvases = new Map<string, HTMLCanvasElement | null>()

// Track metadata status for each stream
const streamMetadataStatus = new Map<string, MetadataStatus>()

// Track metadata callbacks for each component using a stream
const metadataCallbacks = new Map<string, Set<(status: MetadataStatus) => void>>()

// Track cleanup functions for each stream
const streamCleanupFunctions = new Map<string, () => void>()

interface UseCameraStreamOptions {
  url: string
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onMetadata: (status: MetadataStatus) => void
}

export function useCameraStream({
  url,
  canvasRef,
  onMetadata,
}: UseCameraStreamOptions) {
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Register this canvas as the active one for this URL
    activeCanvases.set(url, canvasRef.current)
    
    // Register the onMetadata callback for this component
    if (!metadataCallbacks.has(url)) {
      metadataCallbacks.set(url, new Set())
    }
    metadataCallbacks.get(url)?.add(onMetadata)
    
    // Create a new emitter if this is the first time initializing this stream
    if (!streamEmitters.has(url)) {
      console.log(`[STREAM DEBUG] Creating NEW stream for URL: ${url}`)
      const emitter = createMetadataEmitter()
      streamEmitters.set(url, emitter)
      streamMetadataStatus.set(url, 'safe')
      
      // Initialize the stream with the worker
      startMetadataStream(emitter, {
        url,
        username: 'admin',
        password: '1234',
        onFrame: (blob) => {
          // Always update the frame, even during danger events
          streamFrames.set(url, blob)
        },
      }).then(cleanup => {
        // Store the cleanup function if one is returned
        if (cleanup) {
          streamCleanupFunctions.set(url, cleanup)
        }
      }).catch(error => {
        console.error('[STREAM ERROR] Failed to start stream:', error)
      })
      
      // Set up metadata listener
      emitter.on('metadata', (status: MetadataStatus) => {
        const previousStatus = streamMetadataStatus.get(url) || 'safe'
        streamMetadataStatus.set(url, status)
        
        // Only trigger callbacks when transitioning to danger
        if (previousStatus !== 'danger' && status === 'danger') {
          // Notify all registered components
          metadataCallbacks.get(url)?.forEach(callback => {
            callback(status)
          })
        }
      })
    } else {
      console.log(`[STREAM DEBUG] Using EXISTING stream for URL: ${url}`)
    }
    
    // Drawing function to render frames on the canvas
    const draw = async () => {
      // Store a local reference to the canvas to ensure it doesn't change during execution
      const currentCanvas = canvasRef.current
      const activeCanvas = activeCanvases.get(url)
      
      // Even if there's a reference mismatch, we'll still try to draw if we have a valid canvas
      // This makes the stream more resilient to temporary UI changes
      if (activeCanvas !== currentCanvas && currentCanvas) {
        console.log("[STREAM DEBUG] Canvas reference mismatch - attempting to draw anyway")
        // Update the active canvas reference to the current one
        activeCanvases.set(url, currentCanvas)
      }
      
      const frame = streamFrames.get(url)
      
      // Skip if there's no frame or canvas
      if (!frame || !currentCanvas) {
        rafIdRef.current = requestAnimationFrame(draw)
        return
      }

      const ctx = currentCanvas.getContext('2d')
      if (!ctx) {
        rafIdRef.current = requestAnimationFrame(draw)
        return
      }

      try {
        const img = await createImageBitmap(frame);
        currentCanvas.width = img.width;
        currentCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // Don't clear the frame after drawing to avoid losing frames during UI updates
      } catch (e) {
        console.warn('[STREAM ERROR] Failed to draw frame:', e);
      }

      rafIdRef.current = requestAnimationFrame(draw)
    }

    // Start the drawing loop
    rafIdRef.current = requestAnimationFrame(draw)

    return () => {
      // When component unmounts, check if this canvas is still the active one
      if (activeCanvases.get(url) === canvasRef.current) {
        activeCanvases.set(url, null)
      }
      
      // Cancel animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      
      // Remove this component's metadata callback
      const callbacks = metadataCallbacks.get(url)
      if (callbacks) {
        callbacks.delete(onMetadata)
      }
      
      // Note: We don't remove the emitter or clean up the stream
      // This ensures the stream keeps running when navigating between routes
      // If you want to reset streams when completely exiting the dashboard,
      // that should be handled at a higher level
      
      // If there are no more components using this stream, we could clean it up
      // Uncomment this code if you want to clean up streams when no components are using them
      /*
      if (callbacks && callbacks.size === 0) {
        console.log(`[STREAM DEBUG] No more components using stream for URL: ${url}, cleaning up`)
        const cleanup = streamCleanupFunctions.get(url)
        if (cleanup) {
          cleanup()
          streamCleanupFunctions.delete(url)
        }
        streamEmitters.delete(url)
        streamFrames.delete(url)
        streamMetadataStatus.delete(url)
        metadataCallbacks.delete(url)
      }
      */
    }
  }, [url, onMetadata])

}
