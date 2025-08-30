import { Camera, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="h-full bg-gradient-to-br flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 relative">
            <Camera className="w-12 h-12 text-gray-400" />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shadow-md">
            <Search className="w-5 h-5 text-orange-500" />
          </div>
          </div>
          
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Category Does Not Have Cameras!</h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          We couldn't find any cameras in this category. Try check back later for new
          arrivals.
        </p>
      </div>
    </div>
  )
}
