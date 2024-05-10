import fetch from "cross-fetch";

export const SearchMovie = async (query: string, page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?&query=${query}&page=${page}&include_adult=false`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};