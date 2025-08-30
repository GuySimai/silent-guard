  // lib/camera-connection.ts
  import { EventEmitter } from 'events'

  export type MetadataStatus = 'safe' | 'danger' | 'unknown'

  interface Options {
    url: string
    username: string
    password: string
    onFrame: (frame: Blob) => void
  }

  // Store active workers by URL to prevent duplicate connections
  const activeWorkers = new Map<string, Worker>()

  export function createMetadataEmitter(): EventEmitter {
    return new EventEmitter()
  }

  export async function startMetadataStream(
    emitter: EventEmitter,
    { url, username, password, onFrame }: Options
  ) {
    // If a worker already exists for this URL, don't create a new one
    if (activeWorkers.has(url)) {
      console.log(`[STREAM] Using existing worker for ${url}`)
      return
    }
    
    console.log(`[STREAM] Creating new worker for ${url}`)
    
    // Create a worker for this stream
    const workerCode = `
      // Worker for camera stream processing
      self.addEventListener('message', async (e) => {
        const { url, username, password } = e.data;
        
        try {
          const boundary = new Uint8Array([45, 45, 102, 114, 97, 109, 101]); // "--frame"
          let buffer = new Uint8Array();
          
          const response = await fetch(
            \`http://81.218.244.80:5000/stream?url=\${encodeURIComponent(url)}\`,
            {
              headers: {
                Authorization: 'Basic ' + btoa(username + ':' + password),
              },
            }
          );
          
          const reader = response.body?.getReader();
          
          while (true) {
            const { value, done } = await reader?.read() || {};
            if (done || !value) {
              self.postMessage({ type: 'streamEnded' });
              break;
            }
            
            const combined = new Uint8Array(buffer.length + value.length);
            combined.set(buffer);
            combined.set(value, buffer.length);
            buffer = combined;
            
            let boundaryIndex;
            while ((boundaryIndex = indexOfSubarray(buffer, boundary)) !== -1) {
              const part = buffer.slice(0, boundaryIndex);
              buffer = buffer.slice(boundaryIndex + boundary.length);
              
              const headerEndBytes = new Uint8Array([13, 10, 13, 10]); // "\\r\\n\\r\\n"
              const headerEnd = indexOfSubarray(part, headerEndBytes);
              if (headerEnd === -1) continue;
              
              const headerBytes = part.slice(0, headerEnd);
              const bodyBytes = part.slice(headerEnd + 4);
              
              // Convert header bytes to string to parse metadata
              const headerText = new TextDecoder().decode(headerBytes);
              const metadataMatch = headerText.match(/Metadata:\\s*(.+)/);
              const metadata = (metadataMatch?.[1]?.trim() || 'unknown');
              
              // Send the frame and metadata back to the main thread
              const frameBlob = new Blob([bodyBytes], { type: 'image/jpeg' });
              
              // We need to transfer the data back to the main thread
              // Since we can't transfer Blobs directly, we'll send the array buffer
              self.postMessage(
                { 
                  type: 'frame', 
                  frame: frameBlob, 
                  metadata 
                },
                // No transferables for Blob, it will be cloned
              );
            }
          }
        } catch (error) {
          self.postMessage({ type: 'error', error: error.message });
        }
        
        function indexOfSubarray(buffer, sub) {
          for (let i = 0; i <= buffer.length - sub.length; i++) {
            let match = true;
            for (let j = 0; j < sub.length; j++) {
              if (buffer[i + j] !== sub[j]) {
                match = false;
                break;
              }
            }
            if (match) return i;
          }
          return -1;
        }
      });
      
      // Notify that the worker is ready
      self.postMessage({ type: 'ready' });
    `;
    
    // Create a blob URL for the worker
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    // Create the worker
    const worker = new Worker(workerUrl);
    
    // Store the worker for this URL
    activeWorkers.set(url, worker);
    
    // Set up message handling from the worker
    worker.addEventListener('message', (event) => {
      const { type, frame, metadata, error } = event.data;
      
      switch (type) {
        case 'frame':
          // Process the frame
          onFrame(frame);
          
          // Emit metadata if present
          if (metadata) {
            emitter.emit('metadata', metadata as MetadataStatus);
          }
          break;
          
        case 'error':
          console.error(`[STREAM WORKER ERROR] ${error}`);
          // You might want to emit an error event here
          emitter.emit('error', error);
          break;
          
        case 'streamEnded':
          console.log(`[STREAM] Stream ended for ${url}`);
          // You might want to emit a stream ended event
          emitter.emit('ended');
          break;
          
        case 'ready':
          console.log(`[STREAM] Worker ready for ${url}`);
          break;
      }
    });
    
    // Start the worker by sending the initial message
    worker.postMessage({ url, username, password });
    
    // Return a cleanup function
    return () => {
      // Terminate the worker if needed
      if (activeWorkers.has(url)) {
        console.log(`[STREAM] Terminating worker for ${url}`);
        const worker = activeWorkers.get(url);
        worker?.terminate();
        activeWorkers.delete(url);
        URL.revokeObjectURL(workerUrl);
      }
    };
  }

  // This function is no longer needed in the main thread as it's now in the worker
  function indexOfSubarray(buffer: Uint8Array, sub: Uint8Array): number {
    for (let i = 0; i <= buffer.length - sub.length; i++) {
      let match = true;
      for (let j = 0; j < sub.length; j++) {
        if (buffer[i + j] !== sub[j]) {
          match = false;
          break;
        }
      }
      if (match) return i;
    }
    return -1;
  }
