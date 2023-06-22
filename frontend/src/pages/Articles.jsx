import { FaClock, FaExternalLinkAlt } from "react-icons/fa";
import ReactLoading from "react-loading";
import News from "../utils/News";
import { Link, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";

function Articles() {

    const [news, loading] = useOutletContext();
    const { setReading } = useStateContext();
    
    useEffect(() => {
        setReading(false);
    }, [])

    if (loading) {
        return (
            <div className="text-center">
                <div className="text-info pt-5 d-flex justify-content-center align-items-center">
                    <ReactLoading color="#3470fd" className="text-info" width={"10%"} />
                </div>
            </div>
        )
    }

    if (news === false) {
        return (
            <div className="dashboard text-center">
                <div className="text-info pt-5 d-flex justify-content-center align-items-center">
                    <h3>
                        No items found!
                    </h3>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard">
            {Boolean(news) && <ul className="list-group list-group-flush">
                {
                    news.map((article, index) => (
                        article && <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto row">
                                <div className="col-md-3 col-sm-11 mx-auto">
                                    <img className="mx-auto"
                                        src={News.getThumbnail(article, true)}
                                        width={News.getThumbnail(article).width}
                                        height={News.getThumbnail(article).height}
                                    />
                                </div>
                                <div className="col-md-9 col-sm-11 mx-auto justify-content-start">
                                    <div className="fw-bold mb-2">
                                        <Link to="/article" state={{article: article }} className="text-info">
                                            {News.getTitle(article)}
                                        </Link>
                                    </div>
                                    <div className="fw-bold mb-3">
                                        {News.getAbstract(article)}
                                    </div>
                                    &mdash; {News.getByline(article)}
                                    &nbsp;<FaClock /> {News.getDate(article)}
                                    <a href={News.getUrl(article)} className="text-dark px-3">
                                        <FaExternalLinkAlt />
                                    </a>
                                </div>
                                
                            </div>
                            <span className="badge bg-primary rounded-pill">
                                {News.getSection(article)}
                            </span>
                        </li>
                    ))
                } 
            </ul>
            }
        </div>
    )
}

export default Articles