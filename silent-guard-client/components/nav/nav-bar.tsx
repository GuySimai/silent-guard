
//General imports
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

//Component imports
import LoginButton from "./login-button";
import AdminBar from "./admin-bar";
import { ModeToggle } from "../theme/theme-toggle";

export default async function NavBar() {
  const session = await auth();
  return (
    <nav className="fixed top-0 left-0 w-full z-10 px-15">
      <ul className="flex justify-between items-center w-full">
        <li>
          <Link href="/">
            <Image
              src="/silent-guard.png" // Path to your image
              alt="Profile picture"
              width={100} // Desired width
              height={100} // Desired height
            />
          </Link>
        </li>
        <div className="flex space-x-8">
          <li>
            {session ? <AdminBar session={session}/> : <LoginButton />}
          </li>
          {/* <li>
            <ModeToggle/>
          </li> */}
        </div>
      </ul>
    </nav>
  );
}
