import { FaHome, FaDashcube, FaShoppingCart, FaStar, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

function Sidebar() {

    const { user, setRelevance } = useStateContext()
    const userSrc = user ? user.preferences.source : ""

    return (
        <div className="col-2 side bg-light py-2">
            <nav>
                <ul>
                    <li>
                        <Link to={user ? `/${userSrc === "gua"? "guardian" : userSrc}` : "/"}>
                            <FaHome /> Home
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={e => setRelevance("newest")}>
                            <FaDashcube /> Latest
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={e => setRelevance("relevance")}>
                            <FaStar /> Popular
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={e => setRelevance("oldest")}>
                            <FaClock /> Oldest
                        </a>
                    </li>
                </ul>   
            </nav>
        </div>
    )
}

export default Sidebar;