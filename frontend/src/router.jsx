import { createBrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/MainLayout.jsx"
import FrontLayout from "./layouts/FrontLayout.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Page404 from "./pages/Page404.jsx"
import Reader from "./pages/Reader.jsx"
import Articles from "./pages/Articles.jsx"



const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/nyn",
                element: <Articles />,
                index: true
            },
            {
                path: "/guardian",
                element: <Articles />
            },
            {
                path: "/news",
                element: <Articles />
            },
            {
                path: "/article",
                element: <Reader />
            },
        ]
    },
    {
        path: "/",
        element: <FrontLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
        ]
    },
    {
        path: "*",
        element: <Page404 />
    },

])

export default router;