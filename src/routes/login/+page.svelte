<script lang="ts">
    import { loginUser } from "$lib/user";
    import { goto } from "$app/navigation";
    import { fade } from "svelte/transition";

    let credentials = {
        email: "",
        password: ""
    };
    let loading = false;
    let error = "";

    const validEmailProviders = ['@gmail.com', '@outlook.com', '@icloud.com', '@hotmail.com', '@yahoo.com'];
    
    function isValidEmail(email: string): boolean {
        return validEmailProviders.some(provider => email.toLowerCase().endsWith(provider));
    }

    async function handleLogin() {
        loading = true;
        error = "";
        
        if (!isValidEmail(credentials.email)) {
            error = "Please use a valid email provider (Gmail, Outlook, iCloud, Hotmail, or Yahoo)";
            loading = false;
            return;
        }

        try {
            await loginUser(credentials);
            goto("/");
        } catch (e) {
            error = "Invalid email or password";
        } finally {
            loading = false;
        }
    }

    $: isFormValid = credentials.email && credentials.password && credentials.password.length >= 8;
</script>

<div class="mt-[60px] min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
    <div class="w-full max-w-md" transition:fade>
        <h1 class="text-2xl font-bold mb-8 flex items-center gap-2">
            <i class="ri-login-box-line"></i> Login
        </h1>

        <form on:submit|preventDefault={handleLogin} class="space-y-4">
            <div>
                <label for="email" class="block text-sm opacity-50 mb-1">Email Address</label>
                <input type="email" id="email" bind:value={credentials.email} required class="w-full px-4 py-3 bg-cGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
            </div>

            <div>
                <label for="password" class="block text-sm opacity-50 mb-1">Password</label>
                <input type="password" id="password" bind:value={credentials.password} required class="w-full px-4 py-3 bg-cGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
            </div>

            {#if error}
            <div class="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
            {/if}

            <button type="submit" disabled={loading || !isFormValid} class="w-full py-3 bg-white text-black rounded-lg font-medium disabled:opacity-50">
                {loading ? 'Logging in...' : 'Login'}
            </button>

            <p class="text-center text-sm opacity-50">
                Don't have an account? 
                <a href="/register" class="text-white opacity-100 hover:underline">Create Account</a>
            </p>
        </form>
    </div>
</div>