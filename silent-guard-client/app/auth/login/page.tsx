import LoginForm from "@/components/auth/login/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex h-[98vh]">
      <div className="w-1/2">
        <LoginForm />
      </div>
      <div className="w-1/2 relative">
        <Image 
          alt="Login-Pic" 
          src="/Login-pic.jpg" 
          fill
          className="object-cover rounded-r-xl " 
        />
      </div>
    </div>
  );
}
