<script lang="ts">
    import { getRecommendationsByKeywords, searchKeywords } from "$lib/recommendations";
    import { getMovieTrailer } from "$lib/movies";
    import { goto } from "$app/navigation";
    import { fade, scale } from "svelte/transition";
    import { quintOut } from 'svelte/easing';

    let selectedKeywords: any[] = [];
    let keywordSuggestions: any[] = [];
    let recommendedMovies: any[] = [];
    let searchQuery = "";
    let loading = false;
    let showModal = false;
    let selectedMovie: any = null;
    let trailer: any = null;

    async function searchKeywordSuggestions() {
        if (searchQuery.length > 2) {
            const results = await searchKeywords(searchQuery);
            keywordSuggestions = results.slice(0, 5);
        } else {
            keywordSuggestions = [];
        }
    }

    async function addKeyword(keyword: any) {
        if (!selectedKeywords.find(k => k.id === keyword.id)) {
            selectedKeywords = [...selectedKeywords, keyword];
            searchQuery = "";
            keywordSuggestions = [];
            await getRecommendations();
        }
    }

    function removeKeyword(keywordId: number) {
        selectedKeywords = selectedKeywords.filter(k => k.id !== keywordId);
        if (selectedKeywords.length > 0) {
            getRecommendations();
        } else {
            recommendedMovies = [];
        }
    }

    async function getRecommendations() {
        if (selectedKeywords.length > 0) {
            loading = true;
            const keywordIds = selectedKeywords.map(k => k.id);
            recommendedMovies = await getRecommendationsByKeywords(keywordIds);
            loading = false;
        }
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
</script>

<div class="mt-[60px] max-w-7xl mx-auto py-8 px-4">
    <h2 class="text-2xl font-bold mb-4">
        <i class="ri-magic-line mr-2"></i>
        Movie Recommendations
    </h2>
    
    <div>
        <div class="relative w-full">
            <input type="text" bind:value={searchQuery} on:input={searchKeywordSuggestions} placeholder="Search keywords..." class="w-full px-6 py-4 bg-cGray rounded-xl border border-white/10 focus:outline-none transition-colors text-lg placeholder:text-white/30" />
            <i class="ri-search-line absolute right-6 top-1/2 -translate-y-1/2 opacity-50 text-xl"></i>
            
            {#if keywordSuggestions.length > 0}
            <div class="absolute top-full mt-2 w-full bg-cGray rounded-xl border border-white/10 z-10 shadow-xl backdrop-blur-xl">
                {#each keywordSuggestions as keyword}
                <button on:click={() => addKeyword(keyword)} class="w-full px-6 py-3 text-left hover:bg-cLightGray transition-colors flex items-center gap-3">
                    <i class="ri-price-tag-3-line opacity-50"></i>
                    {keyword.name}
                </button>
                {/each}
            </div>
            {/if}
        </div>

        {#if selectedKeywords.length > 0}
        <div class="flex flex-wrap gap-3 mt-6 mb-4">
            {#each selectedKeywords as keyword}
            <span class="px-4 py-2 bg-cLightGray rounded-xl text-sm flex items-center gap-2 border border-white/10">
                <i class="ri-price-tag-3-line opacity-50"></i>
                {keyword.name}
                <button on:click={() => removeKeyword(keyword.id)} class="hover:text-red-500 transition-colors ml-2" aria-label="Remove keyword">
                    <i class="ri-close-line"></i>
                </button>
            </span>
            {/each}
        </div>
        {/if}
    </div>

    {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {#each Array(4) as _}
        <div class="relative h-[200px] sm:h-[250px] lg:h-[300px] rounded-lg overflow-hidden bg-cGray animate-pulse">
            <div class="absolute bottom-0 p-4 w-full">
                <div class="h-6 w-2/3 bg-cLightGray rounded-lg"></div>
                <div class="flex items-center gap-3 mt-2">
                    <div class="h-4 w-16 bg-cLightGray rounded-lg"></div>
                    <div class="h-4 w-4 bg-cLightGray rounded-lg"></div>
                    <div class="h-4 w-20 bg-cLightGray rounded-lg"></div>
                </div>
            </div>
        </div>
        {/each}
    </div>
    {:else if recommendedMovies.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" transition:fade>
        {#each recommendedMovies as movie}
        <div class="relative h-[200px] sm:h-[250px] lg:h-[300px] rounded-lg overflow-hidden group cursor-pointer">
            <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} class="w-full h-full object-cover brightness-50" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 p-4 w-full">
                <h3 class="text-xl font-bold text-white line-clamp-1">{movie.title}</h3>
                <div class="flex items-center gap-3 text-sm mt-2">
                    <span class="opacity-80">{new Date(movie.release_date).getFullYear()}</span>
                    <span class="opacity-50">•</span>
                    <span class="opacity-80">
                        <i class="ri-heart-fill"></i> {movie.vote_average.toFixed(1)}
                    </span>
                </div>
                <div class="flex items-center gap-3 mt-4">
                    <button on:click={() => goto(`/movie/${movie.id}`)} class="bg-white text-black px-4 py-2 rounded-lg">Watch Movie</button>
                    <button on:click={() => openModal(movie)} class="bg-white text-black px-4 py-2 rounded-lg"><i class="ri-information-fill"></i></button>
                    <button disabled class="bg-white text-black px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"><i class="ri-heart-fill"></i></button>
                </div>
            </div>
        </div>
        {/each}
    </div>
    {/if}
</div>

{#if showModal}
<div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" on:click={closeModal} transition:fade={{ duration: 200 }}>
    <div class="bg-cGray rounded-xl max-w-2xl w-full mx-4 overflow-hidden" on:click|stopPropagation transition:scale={{ duration: 300, easing: quintOut, start: 0.95 }}>
        {#if trailer}
        <div class="relative aspect-video">
            <iframe title={selectedMovie.title} class="w-full h-full" src={`https://www.youtube.com/embed/${trailer.key}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
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
                <button class="opacity-50 hover:text-white transition" on:click={closeModal}>
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