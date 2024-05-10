<script lang="ts">
    import { onMount } from "svelte";
    import { ListMovies } from "$lib/ListMovies";
    import { goto } from "$app/navigation";

    let listData: any = [];
    let randomMovie: any;
    let loading = true;

    onMount(async () => {
        listData = await ListMovies(1);
        randomMovie = listData[Math.floor(Math.random() * listData.length)];
        loading = false;
    });
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <i class="ri-loader-3-line text-5xl animate-spin"></i>
    </div>
{:else}
    <section class="relative py-80">
        {#if randomMovie}
            <div class="absolute inset-0 bg-cover bg-no-repeat" style="background-image: url('https://image.tmdb.org/t/p/original/{randomMovie.backdrop_path}');">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"></div>
                <div class="absolute bottom-0 left-0 text-white px-5 pb-10">
                    <div class="max-w-2xl">
                        <h1 class="text-4xl font-bold mb-2">{randomMovie.title}</h1>
                        <div class="flex mb-2 items-center">
                            <p class="text-sm mr-4"><i class="ri-heart-2-line"></i> {randomMovie.vote_count}</p>
                            <p class="text-sm"><i class="ri-calendar-line"></i> {new Date(randomMovie.release_date).getFullYear()}</p>
                            <p class="text-sm ml-4"><i class="ri-star-line"></i> {randomMovie.popularity}</p>
                        </div>
                        <p class="text-sm">{randomMovie.overview}</p>
                        <div class="mt-4">
                            <button on:click={() => goto(`/movie/${randomMovie.id}`)} class="bg-white text-black py-2 px-10 rounded mr-4"><i class="ri-play-fill"></i> Watch</button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </section>
{/if}