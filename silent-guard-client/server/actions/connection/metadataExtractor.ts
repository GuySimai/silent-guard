
import { EventEmitter } from 'events';

// Define the metadata type
export type MetadataStatus = 'safe' | 'danger' | 'unknown';

// Define the options for the metadata extractor
export interface MetadataExtractorOptions {
  url: string;
  username?: string;
  password?: string;
  reconnectInterval?: number; // ms
}

/**
 * Creates and returns an event emitter that extracts metadata from an MJPEG stream
 * 
 * @param options Configuration options for the stream
 * @returns EventEmitter that emits 'metadata' events with the status
 */
export function createMetadataExtractor(options: MetadataExtractorOptions): EventEmitter {
  const emitter = new EventEmitter();
  const reconnectInterval = options.reconnectInterval || 5000; // Default 5 seconds
  
  let isConnected = false;
  let shouldReconnect = true;
  
  // Function to start the connection
  const connect = async () => {
    if (isConnected) return;
    
    try {
      isConnected = true;
      
      // Format the URL for the proxy server
      let streamUrl = options.url;
      if (!streamUrl.startsWith('http://81.218.244.80:5000/stream?url=')) {
        streamUrl = `http://81.218.244.80:5000/stream?url=${encodeURIComponent(streamUrl)}`;
      }
      
      // Set up authentication
      const headers: Record<string, string> = {};
      if (options.username && options.password) {
        // Use browser-compatible btoa for client-side
        if (typeof window !== 'undefined') {
          const authString = btoa(`${options.username}:${options.password}`);
          headers['Authorization'] = `Basic ${authString}`;
        } else {
          // For server-side (Node.js)
          const authString = Buffer.from(`${options.username}:${options.password}`).toString('base64');
          headers['Authorization'] = `Basic ${authString}`;
        }
      }
      
      console.log(`Connecting to metadata stream: ${streamUrl}`);
      
      // Use fetch API to connect to the stream
      const response = await fetch(streamUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('Response body is null');
      }
      
      const reader = response.body.getReader();
      const boundary = new TextEncoder().encode('--frame');
      const decoder = new TextDecoder();
      let buffer = new Uint8Array();
      
      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        // Combine the new data with existing buffer
        const combined = new Uint8Array(buffer.length + value.length);
        combined.set(buffer);
        combined.set(value, buffer.length);
        buffer = combined;
        
        // Find frame boundaries
        let boundaryIndex;
        while ((boundaryIndex = indexOfSubarray(buffer, boundary)) !== -1) {
          const part = buffer.slice(0, boundaryIndex);
          buffer = buffer.slice(boundaryIndex + boundary.length);
          
          // Find the end of headers
          const headerEnd = indexOfSubarray(part, new TextEncoder().encode('\r\n\r\n'));
          if (headerEnd === -1) continue;
          
          // Extract and parse headers
          const header = decoder.decode(part.slice(0, headerEnd));
          
          // Extract metadata from header
          const metadataMatch = header.match(/Metadata:\s*(.+)/);
          const metadataValue = metadataMatch ? metadataMatch[1].trim() : 'unknown';
          
          // Emit the metadata event
          let status: MetadataStatus = 'unknown';
          if (metadataValue.toLowerCase() === 'safe') {
            status = 'safe';
          } else if (metadataValue.toLowerCase() === 'danger') {
            status = 'danger';
          }
          
          emitter.emit('metadata', status);
        }
      }
    } catch (error) {
      console.error('Error in metadata extractor:', error);
    } finally {
      isConnected = false;
      
      // Reconnect if needed
      if (shouldReconnect) {
        console.log(`Reconnecting in ${reconnectInterval}ms...`);
        setTimeout(connect, reconnectInterval);
      }
    }
  };
  
  // Start the connection
  connect();
  
  // Method to stop the connection
  const stop = () => {
    shouldReconnect = false;
  };
  
  // Add stop method to the emitter
  (emitter as any).stop = stop;
  
  return emitter;
}

/**
 * Helper function to find a subarray within an array
 */
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

/**
 * Formats a camera URL for use with the metadata extractor or img tag
 * 
 * @param url The base camera URL
 * @param username Optional username for authentication
 * @param password Optional password for authentication
 * @returns Formatted URL
 */
export function formatCameraUrl(url: string, username?: string, password?: string): string {
  // Format the URL for the proxy server
  let streamUrl = url;
  if (!streamUrl.startsWith('http://81.218.244.80:5000/stream?url=')) {
    streamUrl = `http://81.218.244.80:5000/stream?url=${encodeURIComponent(streamUrl)}`;
  }
  
  // Add authentication if provided
  if (username && password) {
    // For direct use in img tag or fetch, embed the credentials in the URL
    const authPart = `${username}:${password}@`;
    
    // Check if the URL already has authentication
    if (!streamUrl.includes('@')) {
      // Insert authentication before the hostname
      const urlParts = streamUrl.split('://');
      if (urlParts.length === 2) {
        streamUrl = `${urlParts[0]}://${authPart}${urlParts[1]}`;
      }
    }
  }
  
  return streamUrl;
}
