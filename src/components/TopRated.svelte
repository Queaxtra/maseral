<script lang="ts">
    import { onMount } from "svelte";
    import { TopRated } from "$lib/TopRated";
    import { goto } from "$app/navigation";

    let listTopRated: any = [];
    let pageNum = 1;
    let loading = true;

    onMount(async () => {
        listTopRated = await TopRated(pageNum);
        loading = false;
    });

    const incrementPage = async () => {
        pageNum += 1;
        listTopRated = await TopRated(pageNum);
    };

    const decrementPage = async () => {
        if (pageNum > 1) {
            pageNum -= 1;
            listTopRated = await TopRated(pageNum);
        }
    };
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <i class="ri-loader-3-line text-5xl animate-spin"></i>
    </div>
{:else}
    {#if listTopRated}
        <div class="py-10 px-5">
            <div class="flex items-center justify-between mb-5">
                <h1 class="text-3xl font-semibold">Top Rated</h1>
                <div class="flex items-center">
                    <button on:click={decrementPage} disabled={pageNum === 1} style:opacity={pageNum === 1 ? 0.5 : 1} class="bg-[#242424] text-white py-2 px-3 rounded-full mr-2">
                        <i class="ri-arrow-left-line"></i>
                    </button>
                    <button on:click={incrementPage} class="bg-[#242424] text-white py-2 px-3 rounded-full">
                        <i class="ri-arrow-right-line"></i>
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-5">
                {#each listTopRated as item}
                    <div class="bg-[#242424] p-2 rounded-md flex flex-col justify-between">
                        <div>
                            <img class="rounded-md" src="https://image.tmdb.org/t/p/original/{item.poster_path}" alt={item.title} />
                            <div class="py-3">
                                <h1 class="font-semibold">{item.title}</h1>
                                <p class="text-sm mt-2 mb-2 opacity-80">{item.overview.substring(0, 200)}...</p>
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <button on:click={() => goto(`/movie/${item.id}`)} class="bg-white text-black py-2 w-96 rounded"><i class="ri-play-fill"></i> Watch</button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
{/if}