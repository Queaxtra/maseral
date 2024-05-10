import fetch from "cross-fetch";

export const UpcomingMovies = async (page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
}