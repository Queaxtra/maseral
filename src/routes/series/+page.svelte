<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { listSeries, getSeriesTrailer } from "$lib/series";
    import { fade, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let series: any = [];
    let loading = true;
    let showModal = false;
    let selectedSeries: any = null;
    let currentPage = 1;
    let trailer: any = null;

    async function loadSeries(page: number) {
        loading = true;
        const data = await listSeries(page);
        series = data;
        loading = false;
    }

    async function openModal(show: any) {
        selectedSeries = show;
        showModal = true;
        trailer = await getSeriesTrailer(show.id);
        console.log(trailer);
    }

    function closeModal() {
        showModal = false;
        trailer = null;
    }

    function nextPage() {
        currentPage++;
        loadSeries(currentPage);
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            loadSeries(currentPage);
        }
    }

    onMount(() => {
        loadSeries(currentPage);
    });
</script>

<Navbar />

<div class="mt-[60px] max-w-7xl mx-auto py-8 px-4">
    <div class="flex flex-col items-center text-center mb-12">
        <h1 class="text-4xl font-bold mb-4"><i class="ri-tv-fill"></i> Explore TV Series</h1>
        <p class="text-lg opacity-70 max-w-2xl">Discover the most popular TV shows from around the world. From drama to comedy, find your next binge-worthy series here.</p>
    </div>

    <div class="flex justify-center mb-8">
        <div class="flex gap-4 bg-cGray p-2 rounded-lg">
            <button on:click={prevPage} class="px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-cLightGray transition-colors" disabled={currentPage === 1}>
                <i class="ri-arrow-left-line"></i>
            </button>
            <span class="px-6 py-2 bg-cLightGray rounded-lg">Page {currentPage}</span>
            <button on:click={nextPage} class="px-6 py-2 rounded-lg hover:bg-cLightGray transition-colors">
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
        {#each series as show}
        <div class="relative h-[300px] rounded-lg overflow-hidden">
            <img src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`} alt={show.name} class="w-full h-full object-cover brightness-50" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 p-4 w-full">
                <h3 class="text-xl font-bold text-white">{show.name}</h3>
                <div class="flex items-center gap-3 text-sm mt-2">
                    <span class="opacity-80">{new Date(show.first_air_date).getFullYear()}</span>
                    <span class="opacity-50">•</span>
                    <span class="opacity-80"><i class="ri-heart-fill"></i> {show.vote_average.toFixed(1)}</span>
                </div>
                <div class="flex items-center gap-3 mt-4">
                    <button on:click={() => goto(`/series/${show.id}`)} class="bg-white text-black px-4 py-2 rounded-lg">Watch Series</button>
                    <button on:click={() => openModal(show)} class="bg-white text-black px-4 py-2 rounded-lg"><i class="ri-information-fill"></i></button>
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
                <iframe
                    title={selectedSeries.name}
                    class="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        {:else}
            <div class="relative h-[300px]">
                <img src={`https://image.tmdb.org/t/p/original${selectedSeries.backdrop_path}`} alt={selectedSeries.name} class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
            </div>
        {/if}
        
        <div class="p-6">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-2xl font-bold">{selectedSeries.name}</h2>
                    <div class="flex items-center gap-3 text-sm mt-2 opacity-50">
                        <span>{new Date(selectedSeries.first_air_date).getFullYear()}</span>
                        <span>•</span>
                        <span><i class="ri-heart-fill"></i> {selectedSeries.vote_average.toFixed(1)}</span>
                    </div>
                </div>
                <button class="opacity-50 hover:text-white transition" on:click={closeModal}>
                    <i class="ri-close-line text-2xl"></i>
                </button>
            </div>
            <p class="mt-4 opacity-70 leading-relaxed font-light">{selectedSeries.overview}</p>
            <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="opacity-50">First Air Date:</span>
                    <p class="text-white">{selectedSeries.first_air_date}</p>
                </div>
                <div>
                    <span class="opacity-50">Vote Count:</span>
                    <p class="text-white">{selectedSeries.vote_count}</p>
                </div>
                <div>
                    <span class="opacity-50">Original Language:</span>
                    <p class="text-white">{selectedSeries.original_language.toUpperCase()}</p>
                </div>
                <div>
                    <span class="opacity-50">Popularity:</span>
                    <p class="text-white">{selectedSeries.popularity.toFixed(0)}</p>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}