
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';
import { getCameras } from '@/server/actions/getCameras';
import CameraStreamerManager from '@/components/dashboard/camera-side/hook/camera-stream';

export default async function WelcomeDashboard() {

  const session = await auth()

  if (!session) {
    return <div>Unauthorized</div>
  }


  return (
    <>
    <div className="relative h-full bg-gradient-to-br from-blue-100 via-white to-blue-200 justify-center p-8">
      {/* Background Image (optional, you can remove if not needed) */}
      <div className="absolute inset-0 z-0 opacity-90">
        <Image
          src="/dashboard-bg.png" // place your own image in /public folder
          alt="Dashboard Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Dashboard Card */}
      <div className="relative flex flex-col h-full justify-center items-center bg-transparent rounded-2xl p-10 max-w-lg w-full text-center space-y-4">
        <div>
           <h1 className="text-[45px] font-bold text-gray-800 uppercase">Welcome to Your Dashboard!</h1>
           <p className="text-gray-500">Manage your camera feeds with ease</p>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <Button asChild
            className=" text-white px-10 cursor-pointer py-5 rounded-xl font-semibold hover:bg-gray-900 transition"
          >
            <Link href={"/dashboard/recordings"}>
             Recordings
            </Link>
          </Button>
        </div>
        <Button asChild variant={"link"}
            className=" cursor-pointer text-black"
          >
            <Link href={"/dashboard/settings"}>
               Manage Your Account
            </Link>
          </Button>
      </div>
    </div>
    </>
    
  );
}