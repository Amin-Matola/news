import { useEffect } from "react";
import {Outlet, useNavigate} from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"

function FrontLayout() {

    const
        { token, user } = useStateContext(),
        navigate = useNavigate();
    
    useEffect(() => {
        if (token && user) {
            return navigate("/")
        }
    }, [token, user])

    if (token && user) {
        return (
            <div className="content">
            </div>
        )
    }
    
    return (
        <div className="content">
            <Outlet />
        </div>
    )
}

export default FrontLayout