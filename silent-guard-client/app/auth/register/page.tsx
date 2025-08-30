//General Imports
import Image from "next/image";

//My components import
import { RegisterForm } from "@/components/auth/register/register-form";


export default function RegisterPage(){
    return (
     <div className="flex h-[98vh]">
      <div className="w-1/2">
        <RegisterForm/>
      </div>
      <div className="w-1/2 relative">
        <Image 
          alt="Login-Pic" 
          src="/background-imgae.jpg" 
          fill
          className="object-cover rounded-r-xl " 
        />
      </div>
    </div>
    )
}


