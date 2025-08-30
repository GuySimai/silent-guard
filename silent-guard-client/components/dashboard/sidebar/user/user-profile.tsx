//ShadcnUi imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//Auth imports
import { auth } from "@/auth";


export default async function UserProfile() {
    const session = await auth();

    //Handle later
    if(!session) {
        return ;
    }

    const user = session.user!;

    return (
      <div className="flex space-x-2">
        <div className="relative">
        <Avatar className="size-10 ">
          <AvatarImage src="/profile-avatar.png"/>
          <AvatarFallback className="bg-blue-300">{user.name}</AvatarFallback>
        </Avatar>
        <div className="absolute right-0 -bottom-0.5">
            <span className="relative flex size-3">
                <span className="absolute bottom-0 right-0 inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-green-600"></span>
            </span>
        </div>
        
        
        </div>
        <div className="flex flex-col text-sm">
            <span className="tracking-wider font-bold">{user.name}</span>
            <span className="text-[10px]">{user.email}</span>
        </div>
      </div>
    )
  }