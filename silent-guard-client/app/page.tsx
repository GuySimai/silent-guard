//UI imports
import Clouds from "@/components/home/utilities/clouds";
import { HomeHeader } from "@/components/home/header-home";
import HomeBackground from "@/components/home/utilities/home-background";

export default function Home() {
  
  return (
    <div className="flex h-[97vh] bg-[#c1eeff] rounded-lg relative">
      <Clouds/>
      <div className="w-1/2 relative">   
        <HomeHeader/>
      </div>
      <div className="w-1/2 h-full relative">
         <HomeBackground/>
      </div>
    </div>
  );
}
