import { NavLink } from "react-router-dom"

const MainPage = () => {
    
    return <div className="container">
        <h1 className="text-center">Live Streaming Demo</h1>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <NavLink to={ "/streamer" } >Streamer</NavLink>
                </li>
                <li className="nav-item active">
                    <NavLink to={ "/viewer" } >Viewer</NavLink>
                </li>
                </ul>
            </div>
            </nav>        
    </div>
}

export default MainPage