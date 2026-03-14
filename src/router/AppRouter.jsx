import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Productos from "../pages/Productos";
import Dashboard from "../pages/Dashboard";

function AppRouter(){

return(

<BrowserRouter>

<Routes>

<Route element={<AdminLayout/>}>

<Route path="/" element={<Dashboard/>} />

<Route path="/productos" element={<Productos/>} />

</Route>

</Routes>

</BrowserRouter>

)

}

export default AppRouter