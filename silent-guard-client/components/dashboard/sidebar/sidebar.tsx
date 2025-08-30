import SideBarHeader from './sidebar-header';
import SideBarFooter from './sidebar-footer';
import SideBarContent from './sidebar-content';
import SideBarView from './sidebar-view';
 
export default function SideBar() {
  return (
    <div className=" flex flex-col py-2 px-4 h-full pt-15 justify-evenly">
      <div className='flex flex-col gap-4'>
        <div className='p-3 bg-slate-100 rounded-3xl shadow-md'>
          <SideBarHeader/>
        </div>
        <div className='p-2  bg-slate-100 rounded-xl shadow-sm'>
          <SideBarView/>
        </div>
      </div>

        <div className='px-2 flex flex-col gap-2 '>
          <span className='border-b border-gray-200 text-sm text-gray-400'>Your Camera Zones</span>
          <SideBarContent/>
        </div>

      <div className='border-t border-gray-200'>
        <div className='mt-2 bg-slate-100 rounded-3xl shadow-md '>
          <SideBarFooter/>
        </div>
      </div>
    </div>
  )
}