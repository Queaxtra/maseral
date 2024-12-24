<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
</script>

<div class="h-screen flex flex-col items-center justify-center px-4" transition:fade={{ duration: 300 }}>
    <div class="text-center max-w-2xl mx-auto">
        <h1 class="text-8xl font-bold mb-4">{$page.status}</h1>
        <p class="text-xl mb-8 opacity-60">{$page.error?.message}</p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" class="px-8 py-3 bg-cGray rounded-lg border border-white/10 flex items-center justify-center gap-2">
                <i class="ri-home-line"></i>
                Go Home
            </a>
            <button on:click={() => goto("/")} class="px-8 py-3 bg-cGray rounded-lg border border-white/10 flex items-center justify-center gap-2">
                <i class="ri-arrow-left-line"></i>
                Go Back
            </button>
        </div>
    </div>
</div>