import { Link } from "react-router-dom";

function Sidebar(){

return(

<div className="sidebar">

<h2>RiquiHouse</h2>

<ul>

<li>
<Link to="/">Dashboard</Link>
</li>

<li>
<Link to="/productos">Productos</Link>
</li>

</ul>

</div>

)

}

export default Sidebar