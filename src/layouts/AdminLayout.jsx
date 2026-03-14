import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/layout.css";

function AdminLayout(){

return(

<div className="app-container">

<Sidebar/>

<div className="main-content">

<Navbar/>

<div className="page-content">

<Outlet/>

</div>

</div>

</div>

)

}

export default AdminLayout