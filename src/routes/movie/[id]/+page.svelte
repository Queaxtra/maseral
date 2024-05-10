<script lang="ts">
    import { page } from "$app/stores";
    import { FetchMovie } from "$lib/FetchMovie";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"; 

    let data: any = {};
    let loading = true;

    onMount(async () => {
        data = await FetchMovie($page.params.id);
        loading = false;
    });
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <i class="ri-loader-3-line text-5xl animate-spin"></i>
    </div>
{:else}
    <section class="relative py-80">
        {#if data}
            <div class="absolute inset-0 bg-cover bg-no-repeat" style="background-image: url('https://image.tmdb.org/t/p/original/{data.backdrop_path}');">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"></div>
                <div class="absolute bottom-0 left-0 text-white px-5 pb-10">
                    <div class="max-w-2xl">
                        <h1 class="text-4xl font-bold mb-2">{data.title}</h1>
                        <div class="flex mb-2 items-center text-xs md:text-sm">
                            <p class="mr-4"><i class="ri-heart-2-line"></i> {data.vote_count}</p>
                            <p><i class="ri-calendar-line"></i> {data.release_date}</p>
                            <p class="ml-4"><i class="ri-star-line"></i> {data.popularity}</p>
                            <p class="ml-4"><i class="ri-money-dollar-circle-line"></i> {Math.floor(data.budget) .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                            <p class="ml-4"><i class="ri-earth-line"></i> {data.original_language}</p>
                            <p class="ml-4"><i class="ri-chat-poll-line"></i> {data.vote_average}</p>
                        </div>
                        <p class="text-sm">{data.overview}</p>
                        <div class="mt-4">
                            <button on:click={() => goto(`/`)} class="bg-white text-black py-2 px-10 rounded mr-4"><i class="ri-arrow-left-line"></i> Back</button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </section>

    <!-- svelte-ignore a11y-missing-attribute -->
    <iframe class="w-full h-screen mt-20" src="https://vidsrc.to/embed/movie/{data.id}" frameborder="0" allowfullscreen></iframe>
{/if}