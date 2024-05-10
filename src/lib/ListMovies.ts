import fetch from "cross-fetch";

export const ListMovies = async (page: number) => {
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_APP_APIKEY}`
    }
  });
  const data = await response.json();
  return data.results;
};