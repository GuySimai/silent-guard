//UI imports
import { TextEffect } from '@/components/motion-primitives/text-effect';
import HomeButton from './home-button';

export function HomeHeader(){
    return (
        <div className="header absolute top-1/3 left-1/5 z-30 flex flex-col gap-10">

        <TextEffect preset='fade-in-blur' speedReveal={1.1} speedSegment={0.3} className="text-6xl font-bold uppercase inline-block text-[#0d4b6e]">
            YOUR SECURITY, OUR PRIORITY
        </TextEffect>
        <TextEffect preset='fade-in-blur' speedReveal={1.1} speedSegment={0.3}>
            Protecting what matters most — with confidence, care, and cutting-edge solutions.
        </TextEffect>

        <HomeButton/>
          
        </div>
    )
}