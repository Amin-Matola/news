import { useEffect, useState } from "react";
import {Outlet, useNavigate, useLocation} from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"
import MainMenu from "../components/Menu";
import { FaHome, FaBars, FaUsers, FaDashcube, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import DatePicker from "react-date-picker";
import _ from "lodash";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Sidebar from "../components/Sidebar";
import News from "../utils/News";
import Preferences from "../components/Preferences";

function MainLayout() {

    const {
        user,
        token,
        search,
        source,
        setSource,
        loading,
        setLoading,
        reading,
        page,
        pages,
        setPage,
        setPages,
        target,
        setTarget,
        relevance
    } = useStateContext();
    const [date, setDate] = useState(null);
    const [news, setNews] = useState([]);
    const [_news, _setNews] = useState([]);
    const [category, setCategory] = useState(News.extract(user, "preferences", "category"))
    const navigate = useNavigate();

    

    const getSource = () => {
        let path = News.unslash(window.location.pathname)
        var _source = path.endsWith("guardian") ? "gua" : path
    
        return _source
    }

    const moveNext = (e, step = 1) => {
        setPage( page + step)
    }

    const getArticles = (data) => {
        var articles = [], pg = 1;
        if (News.has(data, "results")) {
            articles = data.results
            pg = data.pages;
        }
        else if (News.has(data, "docs")) {
            articles = data.docs
            pg = Math.ceil(data.meta.hits / 10)
        }
        else if (News.has(data, "articles")) {
            articles = data.articles
            pg = data.totalResults
        }
        else {
            articles = [];
        }

        if (pg > 1) {
            setPages(pg)
        }
        
        return articles
    }

    // Retrieve data from server on query
    const retrieve = (filter = "politics") => {
        if (user) {
            setLoading(true);
            News.load(`/news/${source}/${filter}/${page}`, data => {

                    var articles = getArticles(data)
                    if (articles.length) {
                        setNews(articles)
                        _setNews(articles)
                    } else {
                        setNews(false)
                    }
                    setLoading(false)
                },
                error => {
                    setNews(false);
                    setLoading(false);
            })
        }
    }

    const doFilter = () => {
        let filters = {
            date: News.getDate(date, true),
            source: source,
            category: category,
            target: target,
            relevance: relevance
        }
        if (user && _news) {
            setLoading(true)
            News.submit("/news/filter", filters, data => {
                    var articles = getArticles(data)
                    if (articles.length) {
                        setNews(articles)
                        _setNews(articles)
                    }
                    setLoading(false)
            },
                error => {
                    setNews(false)
                    setLoading(false)
                }
            )
        }
    }

    useEffect(() => {
        if (user && search && search.length) {
            let url = `/news/search/${source}/${search}/${page}`
            setLoading(true)
            News.load(url, (data) => {
                var
                articles = getArticles(data);
                setNews(articles)
                _setNews(articles)
                setLoading(false)
            })
        }
    }, [search])
    
    // If there is no access token, then not loggedin
    useEffect(() => {
        
        if (!(token && user)) {
            return navigate("/login")
        }
    }, [token, user])

    useEffect(() => {

        if (News.has(user, "preferences") && (!source || source !== getSource())) {
            var src = user.preferences.source;
            if (src === "gua") src = "guardian"
            setSource(src)
            navigate(`/${src}`);
        }
        
        if ( user && (category || source).length)
        retrieve(category)
    }, [category, source, page])

    useEffect(() => {
        
        if (user && (date || target || relevance)) {
            doFilter();
        }
    }, [date, target, relevance])


    /**
     * The content farther below must only be accessed by logged in user
     * See the effect on token
     * */
    if ( !(token && user) ) {
        return (
            <div className="text-center text-warning mt-t">
                <h3 className="mt-5">Redirecting to login...</h3>
            </div>
        )
    }

    return (
        token &&
        <div className="content">
            <MainMenu />
            <div className="row mx-auto mt-4">
                <Sidebar />
                <Preferences id="settings" />
                <div className="col-md-9 col-sm-12 px-2 main light">
                        {!reading && <div className="col-12 d-flex my-4 pr-2 light"
                            style={{ maxHeight: "20px", gap: "20px" }}>
                            <select name="category" onChange={e => setCategory(e.target.value)} style={{ border: "none" }} id="category">
                                <option>Category</option>
                                <option value="books">Books</option>
                                <option value="culture">Culture</option>
                                <option value="education">Education</option>
                                <option value="environment">Environment</option>
                                <option value="politics">Politics</option>
                                <option value="football">Football</option>
                                <option value="technology">Technology</option>
                            </select>
                            {source === "news" && <select name="target" onChange={e => setTarget(e.target.value)} style={{ border: "none" }} id="category">
                                <option>Source</option>
                                <option value="al-jazeera-english">Al-Jazeera English</option>
                                <option value="bbc-news">BBC News</option>
                                <option value="cbs-news">CBS News</option>
                                <option value="cnn">CNN</option>
                                <option value="fox-sports">Fox Sports</option>
                                <option value="google-news">Google News</option>
                                <option value="techcrunch">Tech Crunch</option>
                            </select>}
                            {source === "nyn" && <select name="target" onChange={e => setTarget(e.target.value)} style={{ border: "none" }} id="category">
                                <option>Source</option>
                                <option value="The New York Times">The New York Times</option>
                                <option value="Reuters">Reuters</option>
                                <option value="International Herald Tribune">
                                    International Herald Tribune
                                </option>
                                <option value="AP">AP</option>
                            </select>}
                            <DatePicker id="date" onChange={setDate} value={date} style={{ border: "none" }} />
                            <span id="counter" className="ml-auto" style={{ marginLeft: "auto", paddingRight: "15px" }}>
                                {news ? news.length : "No"} Articles
                            </span>
                            
                        </div>}
                        {!reading && <h3 className="text-center my-5">
                            {
                                source === "gua" ?
                                    "The Guardian" :
                                    source === "news" ?
                                        "The " + source.toUpperCase() : "New York"
                            }
                            {source !== "news" ? (<span>&nbsp;News</span>) : ""} - {search.length ? search : News.title(category)}
                        </h3>}
                        <Outlet context={[
                            news,
                            loading,
                            reading
                        ]} />
                        
                        {!reading && news && news.length > 0 && <div id="footer mt-3"
                            className="col-12 d-flex pagination text-right text-end py-2 mt-5"
                            style={{ alignItems: "center", marginTop: "auto" }}
                        >
                            {page > 1 && <button onClick={e => moveNext(e, -1)}>
                                <FaAngleDoubleLeft /> Prev</button>}
                                <span className="mx-auto">
                                <span className="viewer">Viewing page </span>
                                    <b>
                                        {page} of {pages}
                                    </b>
                                </span>
                            {page < pages && <button onClick={moveNext} style={{ marginLeft: "auto" }}>Next <FaAngleDoubleRight /></button>}
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default MainLayout