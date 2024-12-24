export const listActors = async (page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};

export const getMovieActors = async (movieId: string) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.cast;
};