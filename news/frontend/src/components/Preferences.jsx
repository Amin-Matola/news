import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import News from "../utils/News";
import $ from "jquery";
import { useState } from "react";

function Preferences(props) {
    const id = props.hasOwnProperty("id") ? props.id : "";
    const {user, setUser, setToken} = useStateContext()
    const [preferences, setPreferences] = useState(user? user.preferences : {})

    const navigate = useNavigate()

    const updatePrefs = (e, submit = false) => {
        e.preventDefault()
        var key = $(e.target).attr("name"), value = $(e.target).val();
        if (preferences.hasOwnProperty(key)) {
            preferences[key] = value
            setPreferences(preferences)
        }

        if (submit) {
            News.submit(`/update`, preferences, (data) => setUser(data))
        }
    }

    const close = () => $(".settings").toggle();

    const logout = (e) => {
        e.preventDefault()
        close()
        News.submit("/logout", {}, (data) => {
            
            setUser(null)
            setToken(null)

            navigate("/")
        })
    }

    return (
        <div className={id} id={id}>
            <h4 className="text-center text-info">Preferences</h4>
            <form className="prefs" onSubmit={e => updatePrefs(e, true)}>
                <div className="form-group">
                    <label htmlFor="source">News Source</label>
                    <select name="source" className="form-control" onChange={ updatePrefs}>
                        <option value={preferences.source}>
                            {preferences.source.toUpperCase()}
                        </option>
                        <option value="nyn">NYN</option>
                        <option value="news">NEWS API</option>
                        <option value="gua">Guardian</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select name="category" className="form-control" onChange={ updatePrefs}>
                        <option value={preferences.category}>
                            {News.title(preferences.category)}
                        </option>
                        <option value="books">Books</option>
                        <option value="culture">Culture</option>
                        <option value="education">Education</option>
                        <option value="environment">Environment</option>
                        <option value="politics">Politics</option>
                        <option value="football">Football</option>
                        <option value="technology">Technology</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select name="type" className="form-control" onChange={ updatePrefs}>
                        <option value={preferences.type}>
                            {News.title(preferences.type)}
                        </option>
                        <option value="relevance">Popular</option>
                        <option value="newest">Latest</option>
                        <option value="oldest">Old Data</option>
                    </select>
                </div>
                <div className="form-group d-flex mt-5">
                    <button className="mx-auto btn btn-info" onClick={close}>Save Changes</button>
                </div>
            </form>
            <div className="mt-5 text-center">
                <Link href="#" onClick={logout}>Logout</Link>
            </div>
        </div>
    )
}

export default Preferences;