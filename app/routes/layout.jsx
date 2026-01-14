import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"

export default function LayoutPage(){
    return (
        <div className="w-full m-auto">
            <Sidebar/>  
            <Outlet/>
        </div>
    )
}