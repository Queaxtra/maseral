const getTimeBasedGenres = (): number[] => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 13) {
        return [16];
    } else if (currentHour >= 13 && currentHour < 18) {
        return [];
    } else {
        return [27, 10749];
    }
};

export const listMovies = async (page: number) => {
    const timeBasedGenres = getTimeBasedGenres();
    const genreQuery = timeBasedGenres.length > 0 ? `&with_genres=${timeBasedGenres.join(',')}` : '';

    const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc${genreQuery}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};

export const topRated = async (page: number) => {
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

export const searchMovies = async (query: string, page: number) => {
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

export const getMovieTrailer = async (movieId: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results.find((video: any) => video.type === "Trailer");
};

export const movieDetails = async (movieId: string) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    return await response.json();
};

export const getSimilarMovies = async (movieId: string, page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=${page}`, {
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results.slice(0, 6);
};

export const getUpcomingMovies = async (page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};