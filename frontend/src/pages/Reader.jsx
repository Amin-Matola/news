import { useEffect, useState } from "react"
import { FaAngleRight, FaClock, FaExternalLinkAlt, FaSignature } from "react-icons/fa";
import News from "../utils/News";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

function Reader() {

    const [loading] = useOutletContext()
    const {setReading, setLoading} = useStateContext()
    const { state } = useLocation()
    const article   = News.extract(state, "article");
    const navigate  = useNavigate()

    console.log(article)

    useEffect(() => {
        setLoading(false)
        setReading(true)
    }, [])
    
    if (!article) {
        return (
            <div className="text-center">
                <div className="text-info pt-5 d-flex justify-content-center align-items-center">
                    <h5 className="text-info text-center">Article Not Found!</h5>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard news p-2 pb-5 mx-auto reader" style={{ maxWidth: "768px" }}>
            <h3 className="d-flex">
                <span onClick={e => navigate(-1)} style={{
                    cursor: "pointer",
                    alignItems: "cemter"
                }}>&larr;</span>
                <span onClick={e => navigate(-1)} style={{
                    marginLeft: "auto",
                    fontSize: "12px",
                    borderBottom: "1px solid grey"
                }}>
                    {News.getSection(article)}
                </span>
            </h3>
            <h1 className="mb-2 text-black py-3">THE NEWS BOARD</h1>
            <hr/>
            <div className="d-flex my-4">
                <span className="">
                    Date: <b>{News.getDate(article)}</b>
                </span>
                <span className="" style={{ marginLeft: "auto" }}>
                    <FaSignature /> {
                        News.getByline(article)
                    }
                </span>
            </div>
            <hr/>
            <h2 className="py-5">{News.getTitle(article)}</h2>
            <p>
                {News.getAbstract(article)}
            </p>
            <div className="row my-5">
                <div className="col-6">
                    <img src={
                        News.getThumbnail(article, true)
                    } className="col-12 featured" />
                    <p>
                        { News.getThumbnail(article).caption}
                    </p>
                </div>
                <div className="col-6" style={{ fontSize: "18px" }}>
                    {News.getAbstract(article)}
                </div>
                <div
                    className="col-12 pt-3" style={{ fontSize: "18px" }}
                    dangerouslySetInnerHTML={{
                        __html: News.getBody(article)
                    }}
                >
                </div>
                <div className="col-12 text-center mt-5 pt-5">
                    <a href={News.getUrl(article)} target="_blank">
                        Read from source <FaExternalLinkAlt />
                    </a>
                </div>
            </div>

        </div>
    )
}

export default Reader