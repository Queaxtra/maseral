<script lang="ts">
    import { onMount } from "svelte";
    import { listActors } from "$lib/actors";
    import { fade } from 'svelte/transition';

    let actors: any = [];
    let loading = true;
    let currentPage = 1;
    let scrollContainer: HTMLElement;

    async function loadActors() {
        loading = true;
        const data = await listActors(Math.floor(Math.random() * 100));
        actors = data;
        loading = false;
    }

    onMount(async () => {
        loadActors();
    });

    function scrollLeft() {
        scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    }

    function scrollRight() {
        scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    }
</script>

<div class="mt-[60px] max-w-7xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold"><i class="ri-team-fill"></i> Popular Actors</h1>
        
        <div class="flex gap-4">
            <button on:click={scrollLeft} class="px-4 py-2 bg-cGray rounded-lg border-white/10 border">
                <i class="ri-arrow-left-line"></i>
            </button>
            <button on:click={scrollRight} class="px-4 py-2 bg-cGray rounded-lg border-white/10 border">
                <i class="ri-arrow-right-line"></i>
            </button>
        </div>
    </div>
    
    {#if loading}
    <div class="flex gap-6 overflow-x-hidden">
        {#each Array(6) as _}
        <div class="min-w-[150px] sm:min-w-[200px] bg-cGray rounded-lg animate-pulse">
            <div class="h-[300px] rounded-lg bg-cLightGray"></div>
            <div class="p-4">
                <div class="h-5 w-2/3 bg-cLightGray rounded-lg"></div>
                <div class="h-4 w-1/2 bg-cLightGray rounded-lg mt-2"></div>
            </div>
        </div>
        {/each}
    </div>
    {:else}
    <div bind:this={scrollContainer} class="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth" transition:fade={{ duration: 300 }}>
        {#each actors as actor}
        <div class="min-w-[150px] sm:min-w-[200px] bg-cGray rounded-lg overflow-hidden">
            <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} class="w-full h-[300px] object-cover" />
            <div class="p-4">
                <h3 class="font-bold text-white">{actor.name}</h3>
                <p class="text-sm opacity-50 mt-1">{actor.known_for_department}</p>
                <div class="flex items-center gap-2 mt-2 text-sm">
                    <i class="ri-heart-fill"></i>
                    <span>{actor.popularity.toFixed(1)}</span>
                </div>
            </div>
        </div>
        {/each}
    </div>
    {/if}
</div>

<style>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>