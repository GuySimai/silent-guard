//Primitive Motion Imports..
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";

//General Imports..
import Image from "next/image";


export default function Clouds() {
  return (

    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none opacity-70">
    <InfiniteSlider >
    <Image
          src="/clouds5.png"
          alt="clouds"
          width={1700}
          height={80}
          className="object-contain"
        />
    </InfiniteSlider>
    </div>

  );
}
