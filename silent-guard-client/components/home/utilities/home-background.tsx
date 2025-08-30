//UI imports
import Image from "next/image"

export default function HomeBackground() {
    return (
        <Image 
        alt="background" 
        src="/background-front.png" 
        width={700}
        height={800}
        className="absolute bottom-0 right-0 z-0"
        style={{ zIndex: 0 }}
      />
    )
}