
//My Imports
import AddCameraButton from "./add-camera-button"
import EditCategoryButton from "./edit-categroy-button"
import DeleteCategoryButton from "./delete-category-button"

export default function CategoryDropDown({categoryID}: {categoryID: string}) {
    return(
        <div>
            <div className='flex gap-2'>
                <AddCameraButton categoryID={categoryID}/>
                <EditCategoryButton categoryID={categoryID}/>
                <DeleteCategoryButton categoryID={categoryID} />
            </div>
        </div>
    )   
  }