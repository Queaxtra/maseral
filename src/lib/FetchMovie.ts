import fetch from "cross-fetch";

export const FetchMovie = async (id: string) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data;
}