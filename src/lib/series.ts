export const listSeries = async (page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};

export const getSeriesTrailer = async (seriesId: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/videos?language=en-US`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results.find((video: any) => video.type === "Trailer");
};

export const searchSeries = async (query: string, page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/tv?&query=${query}&page=${page}&include_adult=false`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};

export const getSeriesDetails = async (id: string) => {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, {
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    return await response.json();
};

export const getSimilarSeries = async (seriesId: string, page: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/similar?language=en-US&page=${page}`, {
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};