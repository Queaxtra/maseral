<script lang="ts">
    import { searchMovies } from "$lib/movies";
    import { searchSeries } from "$lib/series";
    import { goto } from "$app/navigation";
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { isUserLoggedIn, logoutUser } from "$lib/user";
    import { onMount } from "svelte";
    
    let searchQuery = "";
    let searchResults: any[] = [];
    let showResults = false;
    let showMobileMenu = false;
    let showMobileSearch = false;
    let userLoggedIn = false;
    let showProfileMenu = false;

    onMount(async () => {
        userLoggedIn = await isUserLoggedIn();
    });

    async function handleLogout() {
        await logoutUser();
        window.location.reload();
    }

    async function handleSearch() {
        if (searchQuery.length > 2) {
            const movieResults = await searchMovies(searchQuery, 1);
            const seriesResults = await searchSeries(searchQuery, 1);
            
            const combinedResults = [
                ...movieResults.map(item => ({ ...item, type: 'movie' })),
                ...seriesResults.map(item => ({ ...item, type: 'series', title: item.name }))
            ].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
            
            searchResults = combinedResults;
            showResults = true;
        } else {
            searchResults = [];
            showResults = false;
        }
    }

    function handleClickOutside(event: MouseEvent) {
        const searchContainer = document.querySelector('.search-container');
        const profileContainer = document.querySelector('.profile-container');
        
        if (searchContainer && !searchContainer.contains(event.target as Node)) {
            showResults = false;
        }
        
        if (profileContainer && !profileContainer.contains(event.target as Node)) {
            showProfileMenu = false;
        }
    }

    function toggleMobileMenu() {
        showMobileMenu = !showMobileMenu;
    }

    function toggleMobileSearch() {
        showMobileSearch = !showMobileSearch;
    }
</script>

<nav class="fixed px-4 py-3 w-full top-0 backdrop-blur-md z-50 border-b border-white/10">
    <div class="flex justify-between items-center max-w-7xl mx-auto">
        <div class="flex items-center space-x-8">
            <a href="/" class="text-2xl font-bold">Maseral</a>
            <ul class="hidden md:flex items-center space-x-8">
                <li>
                    <a href="/" class="opacity-50 hover:opacity-100 transition-all duration-300">Home</a>
                </li>
                <li>
                    <a href="/movies" class="opacity-50 hover:opacity-100 transition-all duration-300">Films</a>
                </li>
                <li>
                    <a href="/series" class="opacity-50 hover:opacity-100 transition-all duration-300">Series</a>
                </li>
            </ul>
        </div>

        <div class="hidden md:flex items-center space-x-4">
            <div class="relative search-container">
                <div class="relative">
                    <input type="text" bind:value={searchQuery} on:input={handleSearch} placeholder="Search..." class="px-4 py-2 bg-cLightGray rounded-lg w-[300px] focus:outline-none border border-white/10 placeholder:text-white/20 font-light" />
                    <i class="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 opacity-50"></i>
                </div>
                
                {#if showResults && searchResults.length > 0}
                <div class="absolute top-full mt-2 w-full bg-cLightGray rounded-lg overflow-hidden z-50 border border-white/10 shadow-xl">
                    {#each searchResults as result}
                    <button on:click={() => { goto(`/${result.type}/${result.id}`); showResults = false; searchQuery = ""; }} class="w-full px-4 py-3 text-left hover:bg-cGray flex items-center gap-3 transition-colors">
                        {#if result.poster_path}
                        <img src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} alt={result.title} class="w-10 h-14 object-cover rounded" />
                        {:else}
                        <div class="w-10 h-14 bg-cGray rounded flex items-center justify-center">
                            <i class="ri-image-line opacity-50"></i>
                        </div>
                        {/if}
                        <div>
                            <p class="font-medium line-clamp-1">{result.title}</p>
                            <p class="text-sm opacity-50">
                                <i class={result.type === 'movie' ? 'ri-film-line' : 'ri-tv-line'}></i>
                                {result.release_date?.split('-')[0] || result.first_air_date?.split('-')[0] || 'N/A'}
                            </p>
                        </div>
                    </button>
                    {/each}
                </div>
                {/if}
            </div>
            {#if userLoggedIn}
            <div class="relative">
                <button on:click={() => showProfileMenu = !showProfileMenu} class="px-4 py-2 bg-cLightGray rounded-lg border border-white/10 flex items-center gap-2">
                    <i class="ri-user-line"></i>
                    Profile
                </button>
                    
                {#if showProfileMenu}
                <div class="absolute right-0 mt-2 w-48 bg-cLightGray rounded-lg overflow-hidden border border-white/10 shadow-xl" transition:slide={{ duration: 200 }} on:click|stopPropagation={() => {}}>
                    <a href="/profile" class="block px-4 py-2 hover:bg-cGray transition-colors">
                        <i class="ri-user-settings-line mr-2"></i>
                        Profile Settings
                    </a>
                    <button on:click={handleLogout} class="w-full text-left px-4 py-2 hover:bg-cGray transition-colors text-red-400">
                        <i class="ri-logout-box-line mr-2"></i>
                        Logout
                    </button>
                </div>
                {/if}
            </div>
            {:else}
            <a href="/login" class="px-8 py-2 bg-cLightGray rounded-lg border border-white/10">
                Login
            </a>
            {/if}
        </div>

        <div class="flex md:hidden items-center space-x-4">
            <button on:click={toggleMobileSearch} class="p-2">
                <i class="ri-search-line text-xl"></i>
            </button>
            <button on:click={toggleMobileMenu} class="p-2">
                <i class="ri-menu-line text-xl"></i>
            </button>
        </div>
    </div>
</nav>

{#if showMobileMenu}
<div class="fixed inset-0 bg-black/50 z-40 md:hidden transition-all duration-300" on:click={toggleMobileMenu}>
    <div class="absolute bottom-0 w-full bg-cLightGray rounded-t-2xl p-6" on:click|stopPropagation transition:slide={{ duration: 300, easing: quintOut }}>
        <ul class="space-y-4">
            <li>
                <a href="/" class="block py-2 opacity-50 hover:opacity-100">Home</a>
            </li>
            <li>
                <a href="/movies" class="block py-2 opacity-50 hover:opacity-100">Movies</a>
            </li>
            <li>
                <a href="/series" class="block py-2 opacity-50 hover:opacity-100">Series</a>
            </li>
            {#if userLoggedIn}
            <li>
                <a href="/profile" class="block py-2 opacity-50 hover:opacity-100">Profile</a>
            </li>
            <li>
                <button on:click={handleLogout} class="block w-full text-left py-2 text-red-400 hover:opacity-100">
                    Logout
                </button>
            </li>
            {:else}
            <li>
                <a href="/login" class="block py-2 opacity-50 hover:opacity-100">Login</a>
            </li>
            {/if}
        </ul>
    </div>
</div>
{/if}

{#if showMobileSearch}
<div class="fixed inset-0 bg-black/50 z-40 md:hidden transition-all duration-300" on:click={toggleMobileSearch}>
    <div class="absolute bottom-0 w-full bg-cLightGray rounded-t-2xl p-6" on:click|stopPropagation transition:slide={{ duration: 300, easing: quintOut }}>
        <div class="relative mb-4">
            <input type="text" bind:value={searchQuery} on:input={handleSearch} placeholder="Search..." class="w-full px-4 py-2 bg-cGray rounded-lg focus:outline-none border border-white/10 placeholder:text-white/20 font-light" />
            <i class="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 opacity-50"></i>
        </div>
        
        {#if showResults && searchResults.length > 0}
        <div class="max-h-[60vh] overflow-y-auto">
            {#each searchResults as result}
            <button on:click={() => { goto(`/${result.type}/${result.id}`); showMobileSearch = false; searchQuery = ""; }} class="w-full px-4 py-3 text-left hover:bg-cGray flex items-center gap-3 transition-colors">
                {#if result.poster_path}
                <img src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} alt={result.title} class="w-10 h-14 object-cover rounded" />
                {:else}
                <div class="w-10 h-14 bg-cGray rounded flex items-center justify-center">
                    <i class="ri-image-line opacity-50"></i>
                </div>
                {/if}
                <div>
                    <p class="font-medium line-clamp-1">{result.title}</p>
                    <p class="text-sm opacity-50">
                        <i class={result.type === 'movie' ? 'ri-film-line' : 'ri-tv-line'}></i>
                        {result.release_date?.split('-')[0] || result.first_air_date?.split('-')[0] || 'N/A'}
                    </p>
                </div>
            </button>
            {/each}
        </div>
        {/if}
    </div>
</div>
{/if}

<svelte:window on:click={handleClickOutside} />