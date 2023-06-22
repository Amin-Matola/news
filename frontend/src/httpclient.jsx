import axios from "axios"

const
    
    httpClient = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE}/api`
    });
httpClient.interceptors.request.use((config) => {
    let token = localStorage.getItem("USER_TOKEN")

    // Set API authorization
    config.headers.Authorization = `Bearer ${token}`

    return config
})

httpClient.interceptors.response.use(
    (response) => {
        // We are only interested in response data
        return response.data
    },
    ( error ) => {
        if (error.response.status === 401) {
            // The token problem, so revoke token
            localStorage.removeItem("API_ACCESS")
        }

        // Otherwise just throw it
        throw error;
})

export default httpClient;