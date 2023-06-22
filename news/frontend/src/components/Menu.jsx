import { FaBars, FaCheck, FaCheckSquare, FaCog, FaFax, FaFlagCheckered, FaFlagUsa, FaNewspaper, FaSearch, FaShieldVirus, FaSignOutAlt, FaSpellCheck, FaTint, FaUserShield } from "react-icons/fa";
import { useStateContext } from "../contexts/ContextProvider";

import $ from "jquery";
import News from "../utils/News";
import { Link } from "react-router-dom";

function MainMenu() {
    const { user, setUser, search, setSearch, setSource } = useStateContext();
    const find = (e) => {
        if ($(e.target).hasClass("searchIt") || e.keyCode === 13) {
            let term = $("#search").val()
            if (term.length > 0) {
                setSearch( term )
                $("#search").val("")
            }
        }
    }

    const modifySource = (src) => {
        if (src)
            setSource(src);
    }

    return (
        <header>
            <nav className="navbar navbar-light px-4 py-0">
                <a className="navbar-brand" href="#">
                    <img src="/images/read-news.png" width="30" height="30" className="d-inline-block align-top" alt=""/>
                    &nbsp;News
                </a>
                <li className="search d-flex">
                    <FaSearch className="searchIt" onClick={find} style={{cursor: "pointer"}} />&nbsp;
                    <input id="search" placeholder="search..." onKeyUp={find}/>
                </li>
                <ul className="d-inline-flex pt-2 px-1">
                    <li><Link to="/nyn" onClick={e => modifySource("nyn")}><FaTint /> NYN</Link></li>
                    <li><Link to="/news" onClick={e => modifySource("news")}><FaFax /> NEWS</Link></li>
                    <li><Link to="/guardian" onClick={e => modifySource("gua")}><FaShieldVirus /> GUARDIAN</Link></li>
                    <li><a href="#" id={"config"}><FaCog onClick={
                        e => {
                            $(".settings").toggle()
                        }
                    }/></a></li>
                </ul>
            </nav>
        </header>
    )
}

export default MainMenu