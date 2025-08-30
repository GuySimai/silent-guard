//Imports UI
import CameraGrid from "@/components/dashboard/camera-side/camera-grid";
import NoCameras from "@/components/dashboard/camera-side/noCameras";
import { getCategoryCameras } from "@/server/actions/getCategoryCameras";

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;

  const res = await getCategoryCameras(categoryId);

  if (res.error || !res.cameras) {
    return <div className="h-full w-full "> <NoCameras /> </div>;
  }

  const cameras = res.cameras;

  return (
      <CameraGrid
        cameras={cameras}
        currentCategory={categoryId}
      />

  );
}
