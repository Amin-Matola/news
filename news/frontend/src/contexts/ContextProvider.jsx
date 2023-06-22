import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    search: "",
    source: "",
    loading: false,
    reading: false,
    page: 1,
    pages: 1,
    target: "nyc",
    relevance: "popular",
    setRelevance: () => {},
    setTarget: () => {},
    setPage: () => {},
    setPages: () => {},
    setLoading: () => { },
    setReading: {},
    setUser: () => { },
    setSearch: () => { },
    setSource: () => { },
    setToken: () => { }
})

/**
 * Function for providing context
 * 
 * @param {children} param0 
 * @return jsx
 */
export function ContextProvider({ children }) {
    const [user, _setUser] = useState(JSON.parse(sessionStorage.getItem("_U")))
    const [search, setSearch] = useState("")
    const [source, setSource] = useState(user? user.preferences.source : "")
    const [loading, setLoading] = useState(false)
    const [reading, setReading] = useState(false)
    const [token, _setToken] = useState(localStorage.getItem("USER_TOKEN"))
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [target, setTarget] = useState(null)
    const [relevance, setRelevance] = useState(null)

    // Now set the actual token
    const setUser = (user) => {
        _setUser(user)
        user ?
            sessionStorage.setItem("_U", JSON.stringify(user)) : 
            sessionStorage.removeItem("_U")
    }
    // Now set the actual token
    const setToken = (token) => {
        _setToken(token)
        token ?
            localStorage.setItem("USER_TOKEN", token) : 
            localStorage.removeItem("USER_TOKEN")
    }

    // Now return the context wrapper
    return (
        <StateContext.Provider value={{ 
            user,
            token,
            search,
            setSearch,
            source,
            setSource,
            setUser,
            setToken,
            loading, 
            setLoading,
            page,
            pages,
            setPage,
            setPages,
            reading,
            setReading,
            target,
            setTarget,
            relevance,
            setRelevance
        }}>
            { children }
         </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)