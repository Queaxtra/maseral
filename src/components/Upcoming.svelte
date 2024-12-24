<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getUpcomingMovies, getMovieTrailer } from "$lib/movies";
    import { fade, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { isUserLoggedIn } from "$lib/user";

    let movies: any = [];
    let loading = true;
    let currentPage = 1;
    let showModal = false;
    let selectedMovie: any = null;
    let trailer: any = null;
    let userLoggedIn = false;

    async function loadMovies(page: number) {
        loading = true;
        const data = await getUpcomingMovies(page);
        movies = data;
        loading = false;
    }

    async function openModal(movie: any) {
        selectedMovie = movie;
        showModal = true;
        trailer = await getMovieTrailer(movie.id);
    }

    function closeModal() {
        showModal = false;
        trailer = null;
    }

    function nextPage() {
        currentPage++;
        loadMovies(currentPage);
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            loadMovies(currentPage);
        }
    }

    onMount(async () => {
        userLoggedIn = await isUserLoggedIn();
        loadMovies(currentPage);
    });
</script>

<div class="mt-[60px] max-w-7xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold"><i class="ri-film-fill"></i> Upcoming Movies</h1>
        
        <div class="flex gap-4">
            <button on:click={prevPage} class="px-4 py-2 bg-cGray rounded-lg disabled:opacity-50 border-white/10 border" disabled={currentPage === 1}>
                <i class="ri-arrow-left-line"></i>
            </button>
            <span class="hidden sm:block px-4 py-2">Page {currentPage}</span>
            <span class="block sm:hidden px-4 py-2">{currentPage}</span>
            <button on:click={nextPage} class="px-4 py-2 bg-cGray rounded-lg border-white/10 border">
                <i class="ri-arrow-right-line"></i>
            </button>
        </div>
    </div>
    
    {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {#each Array(4) as _}
        <div class="relative h-[300px] rounded-lg overflow-hidden bg-cGray animate-pulse">
            <div class="absolute bottom-0 p-4 w-full">
                <div class="h-6 w-2/3 bg-cLightGray rounded-lg"></div>
                <div class="flex items-center gap-3 mt-2">
                    <div class="h-4 w-16 bg-cLightGray rounded-lg"></div>
                    <div class="h-4 w-4 bg-cLightGray rounded-lg"></div>
                    <div class="h-4 w-20 bg-cLightGray rounded-lg"></div>
                </div>
                <div class="flex items-center gap-3 mt-4">
                    <div class="h-10 w-32 bg-cLightGray rounded-lg"></div>
                    <div class="h-10 w-10 bg-cLightGray rounded-lg"></div>
                    <div class="h-10 w-10 bg-cLightGray rounded-lg"></div>
                </div>
            </div>
        </div>
        {/each}
    </div>
    {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" transition:fade={{ duration: 300 }}>
        {#each movies as movie}
        <div class="relative h-[300px] rounded-lg overflow-hidden">
            <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} class="w-full h-full object-cover brightness-50" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 p-4 w-full">
                <h3 class="text-xl font-bold text-white">{movie.title}</h3>
                <div class="flex items-center gap-3 text-sm mt-2">
                    <span class="opacity-80">{new Date(movie.release_date).getFullYear()}</span>
                    <span class="opacity-50">•</span>
                    <span class="opacity-80"><i class="ri-heart-fill"></i> {movie.vote_average.toFixed(1)}</span>
                </div>
                <div class="flex items-center gap-3 mt-4">
                    <button on:click={() => goto(`/movie/${movie.id}`)} class="bg-white text-black px-4 py-2 rounded-lg">Watch Movie</button>
                    <button on:click={() => openModal(movie)} class="bg-white text-black px-4 py-2 rounded-lg"><i class="ri-information-fill"></i></button>
                </div>
            </div>
        </div>
        {/each}
    </div>
    {/if}
</div>

{#if showModal}
<div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" on:click|self={closeModal} transition:fade={{ duration: 200 }}>
    <div class="bg-cGray rounded-xl max-w-2xl w-full mx-4 overflow-hidden" on:click|stopPropagation transition:scale={{ duration: 300, easing: quintOut, start: 0.95 }}>
        {#if trailer}
        <div class="relative aspect-video">
            <iframe title={selectedMovie.title} class="w-full h-full" src={`https://www.youtube.com/embed/${trailer.key}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
        {:else}
        <div class="relative h-[300px]">
                <img src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`} alt={selectedMovie.title} class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
            </div>
        {/if}
        
        <div class="p-6">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-2xl font-bold">{selectedMovie.title}</h2>
                    <div class="flex items-center gap-3 text-sm mt-2 opacity-50">
                        <span>{new Date(selectedMovie.release_date).getFullYear()}</span>
                        <span>•</span>
                        <span><i class="ri-heart-fill"></i> {selectedMovie.vote_average.toFixed(1)}</span>
                    </div>
                </div>
                <button class="opacity-50 hover:text-white transition-colors" on:click={() => closeModal()}>
                    <i class="ri-close-line text-2xl"></i>
                </button>
            </div>
            <p class="mt-4 opacity-70 leading-relaxed font-light">{selectedMovie.overview}</p>
            <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="opacity-50">Release Date:</span>
                    <p class="text-white">{selectedMovie.release_date}</p>
                </div>
                <div>
                    <span class="opacity-50">Vote Count:</span>
                    <p class="text-white">{selectedMovie.vote_count}</p>
                </div>
                <div>
                    <span class="opacity-50">Original Language:</span>
                    <p class="text-white">{selectedMovie.original_language.toUpperCase()}</p>
                </div>
                <div>
                    <span class="opacity-50">Popularity:</span>
                    <p class="text-white">{selectedMovie.popularity.toFixed(0)}</p>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}