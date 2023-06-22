import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import News from "../utils/News";

function Signup() {

    const [errors, setErrors] = useState(null);
    const navigate = useNavigate()
    const signup = (event) => {
        event.preventDefault();
        News.submit("/signup", event.target, (data) => {
            if (data.token)
                navigate("/login", {state: {signed: true}})
        },
        ({ response }) => setErrors(response.data.errors))
    }

    return (
        <div className="row">
            <div className="card col-md-4 col-sm-8 mx-auto px-3 py-3 my-4">
                <form className="form signup-form" onSubmit={signup}>
                    <img
                        className="d-flex mx-auto mb-3"
                        height="50px"
                        width="50px"
                        src="/images/read-news.png" />
                    <h2>Signup To Join</h2>
                    {errors && <div className="alert alert-danger px-2">
                        {Object.keys(errors).map(key => (
                            <li key={key}>{errors[key][0]}</li>
                        ))}
                    </div>}
                    <div className="form-group">
                        <input placeholder="Username" name="name" className="form-control" />
                    </div>
                    <div className="form-group">
                        <input placeholder="Email" type="email" name="email" className="form-control" />
                    </div>
                    <div className="form-group">
                        <input placeholder="Password" type="password" name="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <input placeholder="Confirm" type="password" name="password_confirmation" className="form-control" />
                    </div>
                    <div className="form-group d-flex">
                        <button id="submit" className="btn btn-info text-light">
                            Sign Up
                        </button>
                    </div>
                    <div className="col-12 text-center form-group mt-4 mb-2">
                        Already have account? <a href="/login">Login</a>
                    </div>
                </form>
            </div>
            
        </div>
    )
}

export default Signup