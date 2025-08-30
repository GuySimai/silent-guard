import RecordingsGrid from "@/components/dashboard/recordings/recordings-grid";
import { handleFetchCategories } from "@/server/actions/handle-fetch-categories";



export default async function RecordingsDashboard() {

  const userCategories = await handleFetchCategories();

  return <RecordingsGrid categories={userCategories}/>
    
}

