export const getRecommendationsByKeywords = async (keywords: string[]) => {
    const keywordString = keywords.join(',');
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_keywords=${keywordString}&sort_by=popularity.desc&page=1`, {
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results.slice(0, 6);
};

export const searchKeywords = async (query: string) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/keyword?query=${query}&page=1`, {
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
        }
    });
    const data = await response.json();
    return data.results;
};
