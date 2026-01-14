import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"

export default function LayoutPage(){
    return (
        <div className="w-full max-w-3xl mx-auto px-4 relative">
            <Sidebar/>  
            <Outlet/>

         {
            [1,2,3,4,5,6].map((item) => (
                <div key={item} className="fixed left-0 w-full bottom-0 h-10 bg-white/60 rounded-t-3xl filter blur-3xl"></div>
            ))
         }
        </div>
    )
}