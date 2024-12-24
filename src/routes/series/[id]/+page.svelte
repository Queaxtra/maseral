<script lang="ts">
    import Footer from "../../../components/Footer.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { fade } from "svelte/transition";
    import { getSeriesDetails, getSimilarSeries } from "$lib/series";
    import { goto } from "$app/navigation";
    import { isUserLoggedIn } from "$lib/user";
    import { addFavorite, removeFavorite, isMovieFavorited } from "$lib/favorite";
    import db from "$lib/db";
    import { getSeriesActors } from "$lib/actors";

    let series: any = null;
    let similarSeries: any[] = [];
    let loading = true;
    let currentPage = 1;
    const seriesId = $page.params.id;
    let userLoggedIn = false;
    let isFavorited = false;
    let actors: any[] = [];

    onMount(async () => {
        userLoggedIn = await isUserLoggedIn();
        if (userLoggedIn) {
            const userId = db.authStore?.model?.id;
            isFavorited = await isMovieFavorited(seriesId, userId);
        }
    });

    async function toggleFavorite() {
        if (!userLoggedIn) return;
        const userId = db.authStore?.model?.id;
        
        try {
            if (isFavorited) {
                await removeFavorite(seriesId, userId);
                isFavorited = false;
            } else {
                await addFavorite(seriesId, userId, 'series');
                isFavorited = true;
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    }
    
    async function loadSimilarSeries(page: number) {
        const data = await getSimilarSeries(seriesId, page);
        similarSeries = data;
    }

    function nextPage() {
        currentPage++;
        loadSimilarSeries(currentPage);
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            loadSimilarSeries(currentPage);
        }
    }

    $: {
        if ($page.params.id) {
            const seriesId = $page.params.id;
            Promise.all([
                getSeriesDetails(seriesId),
                getSimilarSeries(seriesId, currentPage),
                getSeriesActors(seriesId)
            ]).then(([seriesData, similarData, actorsData]) => {
                series = seriesData;
                similarSeries = similarData;
                actors = actorsData.slice(0, 12);
                loading = false;
            });
        }
    }
</script>

{#if !loading && series}
<div transition:fade>
    <div class="relative h-[70vh] w-full">
        <img src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`} alt={series.name} class="w-full h-full object-cover brightness-50" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
            <h1 class="text-4xl font-bold mb-4">{series.name}</h1>
            <div class="flex items-center gap-4 text-sm mb-4">
                <span>{new Date(series.first_air_date).getFullYear()}</span>
                <span>•</span>
                <span>{series.number_of_seasons} Seasons</span>
                <span>•</span>
                <span><i class="ri-heart-fill"></i> {series.vote_average.toFixed(1)}</span>
                <span>•</span>
                <span>{series.status}</span>
            </div>
            <div class="flex gap-2 mb-4">
                {#each series.genres as genre}
                <span class="px-3 py-1 bg-white/10 rounded-full text-sm">{genre.name}</span>
                {/each}
            </div>
            <p class="text-lg opacity-80 max-w-3xl mb-6">{series.overview}</p>
            <div class="flex gap-4">
                <button on:click={() => goto("/")} class="bg-white text-black px-6 py-3 rounded-lg">
                    <i class="ri-arrow-left-line mr-2"></i> Back
                </button>
                {#if userLoggedIn}
                <button on:click={toggleFavorite} class="px-6 py-3 rounded-lg transition-colors {isFavorited ? 'bg-red-500 text-white' : 'bg-white text-black'}">
                    <i class="ri-heart-{isFavorited ? 'fill' : 'line'}"></i>
                </button>
                {:else}
                <button disabled class="bg-white text-black px-6 py-3 rounded-lg opacity-50 cursor-not-allowed"><i class="ri-heart-fill"></i></button>
                {/if}
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto py-12 px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 class="text-2xl font-bold mb-4">Series Details</h2>
                <div class="space-y-4">
                    <div>
                        <span class="opacity-50">Status:</span>
                        <p class="text-white">{series.status}</p>
                    </div>
                    <div>
                        <span class="opacity-50">First Air Date:</span>
                        <p class="text-white">{series.first_air_date}</p>
                    </div>
                    <div>
                        <span class="opacity-50">Number of Seasons:</span>
                        <p class="text-white">{series.number_of_seasons}</p>
                    </div>
                    <div>
                        <span class="opacity-50">Number of Episodes:</span>
                        <p class="text-white">{series.number_of_episodes}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h2 class="text-2xl font-bold mb-4">Production</h2>
                <div class="space-y-4">
                    <div>
                        <span class="opacity-50">Production Companies:</span>
                        <div class="flex flex-wrap gap-2 mt-2">
                            {#each series.production_companies as company}
                            <span class="px-3 py-1 bg-cGray rounded-lg text-sm">{company.name}</span>
                            {/each}
                        </div>
                    </div>
                    <div>
                        <span class="opacity-50">Production Countries:</span>
                        <div class="flex flex-wrap gap-2 mt-2">
                            {#each series.production_countries as country}
                            <span class="px-3 py-1 bg-cGray rounded-lg text-sm">{country.name}</span>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto py-12 px-4">
        <h2 class="text-2xl font-bold mb-6">Actors</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {#each actors as actor}
            <div class="bg-cGray rounded-lg overflow-hidden">
                <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://via.placeholder.com/500x750'} alt={actor.name} class="w-full h-[250px] object-cover" />
                <div class="p-4">
                    <h3 class="font-bold text-sm line-clamp-1">{actor.name}</h3>
                    <p class="text-sm opacity-50 mt-1 line-clamp-1">{actor.character}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>

    <div class="max-w-7xl mx-auto py-12 px-4">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">Similar Series</h2>
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

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {#each similarSeries as similar}
            <div class="bg-cGray rounded-lg overflow-hidden cursor-pointer" on:click={() => goto(`/series/${similar.id}`)}>
                <img src={similar.poster_path ? `https://image.tmdb.org/t/p/w500${similar.poster_path}` : 'https://via.placeholder.com/500x750'} alt={similar.title} class="w-full h-[250px] object-cover" />
                <div class="p-4">
                    <h3 class="font-bold text-sm line-clamp-1">{similar.title || "No Titles"}</h3>
                    <div class="flex items-center gap-2 mt-2 text-sm opacity-50">
                        <i class="ri-heart-fill"></i>
                        <span>{similar.vote_average.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            {/each}
        </div>
    </div>

    <div class="max-w-7xl mx-auto py-12 px-4">
        <h2 class="text-2xl font-bold mb-6">Watch Series</h2>
        <div class="aspect-video rounded-lg overflow-hidden">
            <iframe class="w-full h-full" src={`https://vidsrc.to/embed/tv/${series.id}`} frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
</div>
{:else}
<div class="h-screen flex items-center justify-center">
    <i class="ri-loader-4-line animate-spin text-4xl"></i>
</div>
{/if}

<Footer />