<script>
    import Header from "../components/Header.svelte";
    import Films from "../components/Films.svelte";
    import TopRated from "../components/TopRated.svelte";
    import Upcoming from "../components/Upcoming.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let selectedComponent = "films";
    let search = "";
    let loading = true;

    onMount(async () => {
        setTimeout(() => {
            loading = false;
        }, 2000)
    });

    async function searchMovies() {
        goto(`/search/${search}`);
    }
</script>

{#if loading}
<div class="flex justify-center items-center h-screen">
    <i class="ri-loader-3-line text-5xl animate-spin"></i>
</div>
{:else}
<Header />
<div class="flex items-center px-5 mt-10 text-sm">
    <select bind:value={selectedComponent} class="mr-2 bg-[#242424] py-2 px-3 rounded">
        <option value="films">Films</option>
        <option value="top-rated">Top Rated</option>
        <option value="upcoming">Upcoming</option>
        </select>
        <form on:submit|preventDefault={searchMovies}>
            <input type="text" bind:value={search} placeholder="Search..." class="bg-[#242424] px-3 py-2 rounded ml-2 focus:outline-none placeholder:text-[#3d3d3d]" />
        </form>
    </div>

    {#if selectedComponent === "films"}
        <Films />
    {:else if selectedComponent === "top-rated"}
        <TopRated />
    {:else if selectedComponent === "upcoming"}
        <Upcoming />
    {/if}
{/if}