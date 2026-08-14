import axios from "axios";

const api = axios.create({
    baseURL: "https://fintrack-wi01.onrender.com/api/",
    withCredentials: true,
});

export const getCsrfToken = async () => {
    const response = await api.get("csrf/");
    return response.data.csrfToken;
};

export const postWithCsrf = async (url, data) => {
    const csrfToken = await getCsrfToken();
    return api.post(
        url,
        data,
        {
            headers: {
                "X-CSRFToken": csrfToken,
            },
        }
    );
};

export default api;