import { useState } from "react"
import { useLocation } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"
import News from "../utils/News"

function Login() {

    const [errors, setErrors] = useState(null)
    const { setUser, token, setToken } = useStateContext()
    const { state } = useLocation()
    
    const login = ( event ) => {
        event.preventDefault()
        News.submit("/login", event.target, ( data ) => {
            setUser(data.user)
            setToken(data.token)
        }, ({ response }) => {
            var data = response.data, message = data.errors;
            if (response.status === 422)
                message = { why: ["Authentication failed!",] }
            if (response.status === 500)
                message = { why: ["Oops! It's our fault, please try again!",] }
            setErrors(message)
        })
    }
    
    return (
        <div className="row">
            <div className="card col-md-4 col-sm-8 mx-auto py-4 my-5 px-3">
                <form className="form" onSubmit={login}>
                    <img
                        className="d-flex mx-auto mb-3"
                        height="50px"
                        width="50px"
                        src="/images/read-news.png" />
                    <h2>
                        <span>NEWS BOARD</span>
                    </h2>
                    {errors && <div className="alert alert-danger px-2">
                        {Object.keys(errors).map(key => (
                            <li key={key}>{errors[key][0]}</li>
                        ))}
                    </div>}
                    {News.extract(state, "signed") && <div className="px-2 mt-4">
                        <h5 className="alert alert-success">Registered successfully! Now login.</h5>
                    </div>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input name="email" placeholder="john@doe.com" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="******" name="password" className="form-control" />
                    </div>
                    <div className="form-group d-flex">
                    <button id="submit" className="btn btn-info text-light login">
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <div className="col-12 text-center">
                Don't have account? <a href="/signup">New Account</a>
            </div>
        </div>
    )
}

export default Login