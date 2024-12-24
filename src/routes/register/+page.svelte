<script lang="ts">
    import { registerUser } from "$lib/user";
    import { goto } from "$app/navigation";
    import { fade } from "svelte/transition";

    let userData = {
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
        username: "",
        emailVisibility: false,
        admin: false
    };
    let loading = false;
    let error = "";

    const validEmailProviders = ['@gmail.com', '@outlook.com', '@icloud.com', '@hotmail.com', '@yahoo.com'];
    
    function isValidEmail(email: string): boolean {
        return validEmailProviders.some(provider => email.toLowerCase().endsWith(provider));
    }

    async function handleRegister() {
        loading = true;
        error = "";
        
        if (!isValidEmail(userData.email)) {
            error = "Please use a valid email provider (Gmail, Outlook, iCloud, Hotmail, or Yahoo)";
            loading = false;
            return;
        }

        if (userData.password.length < 8) {
            error = "Password must be at least 8 characters long";
            loading = false;
            return;
        }

        if (userData.password !== userData.passwordConfirm) {
            error = "Passwords don't match";
            loading = false;
            return;
        }

        try {
            await registerUser(userData);
            goto("/login");
        } catch (e) {
            error = "Registration failed. Please try again.";
        } finally {
            loading = false;
        }
    }

    $: isFormValid = userData.email && userData.password && userData.password.length >= 8 && userData.passwordConfirm &&userData.password === userData.passwordConfirm &&userData.username;
</script>

<div class="mt-[60px] min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
    <div class="w-full max-w-md" transition:fade>
        <h1 class="text-2xl font-bold mb-8 flex items-center gap-2">
            <i class="ri-user-add-line"></i> Create Account
        </h1>

        <form on:submit|preventDefault={handleRegister} class="space-y-4">
            <div>
                <label for="name" class="block text-sm opacity-50 mb-1">Name</label>
                <input type="text" id="name" bind:value={userData.name} required class="w-full px-4 py-3 bg-cGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
            </div>

            <div>
                <label for="username" class="block text-sm opacity-50 mb-1">Username</label>
                <input type="text" id="username" bind:value={userData.username} required class="w-full px-4 py-3 bg-cGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
            </div>

            <div>
                <label for="email" class="block text-sm opacity-50 mb-1">Email Address</label>
                <input type="email" id="email" bind:value={userData.email} required class="w-full px-4 py-3 bg-cGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
            </div>

            <div>
                <label for="password" class="block text-sm opacity-50 mb-1">Password</label>
                <input type="password" id="password" bind:value={userData.password} required class="w-full px-4 py-3 bg-cGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
            </div>

            <div>
                <label for="passwordConfirm" class="block text-sm opacity-50 mb-1">Confirm Password</label>
                <input type="password" id="passwordConfirm" bind:value={userData.passwordConfirm} required class="w-full px-4 py-3 bg-cGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
            </div>

            {#if error}
            <div class="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
            {/if}

            <button type="submit" disabled={loading || !isFormValid} class="w-full py-3 bg-white text-black rounded-lg font-medium disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p class="text-center text-sm opacity-50">
                Already have an account? 
                <a href="/login" class="text-white opacity-100 hover:underline">Login</a>
            </p>
        </form>
    </div>
</div>