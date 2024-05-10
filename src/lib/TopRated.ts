import fetch from "cross-fetch";

export const TopRated = async (page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
}