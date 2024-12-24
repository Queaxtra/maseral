<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { getUserData, updateUser } from "$lib/user";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import db from "$lib/db";
    import { isUserLoggedIn } from "$lib/user";
    import { getUserFavorites } from "$lib/favorite";
    import { movieDetails } from "$lib/movies";
    import { goto } from "$app/navigation";
    import { removeFavorite } from "$lib/favorite";
    import { getSeriesDetails } from "$lib/series";

    let userData: any = null;
    let loading = false;
    let error = "";
    let success = "";
    let isEditing = false;
    let avatarFile: File | null = null;
    let avatarPreview: string | null = null;
    let activeTab = 'profile';
    let userLoggedIn = false;
    let favoriteMovies: any[] = [];
    let loadingFavorites = false;

    let editedData = {
        name: "",
        username: "",
        email: "",
        emailVisibility: false,
        avatar: null as File | null
    };

    async function loadFavoriteContent() {
        if (!userData) return;
        
        loadingFavorites = true;
        try {
            const favorites = await getUserFavorites(userData.id);
            
            const contentPromises = favorites.map(async fav => {
                if (fav.type === 'series') {
                    const series = await getSeriesDetails(fav.filmId);
                    return { ...series, contentType: 'series' };
                } else {
                    const movie = await movieDetails(fav.filmId);
                    return { ...movie, contentType: 'movie' };
                }
            });
            favoriteMovies = await Promise.all(contentPromises);
        } catch (error) {
            console.error("Failed to load favorites:", error);
        } finally {
            loadingFavorites = false;
        }
    }

    function handleAvatarChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            if (file.type.startsWith('image/')) {
                avatarFile = file;
                avatarPreview = URL.createObjectURL(file);
                editedData.avatar = file;
            } else {
                error = "Please select an image file";
            }
        }
    }

    async function handleRemoveFavorite(movieId: number) {
        try {
            await removeFavorite(movieId.toString(), userData.id);
            favoriteMovies = favoriteMovies.filter(movie => movie.id !== movieId);
        } catch (error) {
            console.error("Failed to remove favorite:", error);
        }
    }

    async function handleUpdateProfile() {
        try {
            loading = true;
            error = "";
            success = "";
            
            const formData = new FormData();
            formData.append('username', editedData.username);
            formData.append('email', editedData.email);
            formData.append('emailVisibility', String(editedData.emailVisibility));
            
            if (editedData.avatar) {
                formData.append('avatar', editedData.avatar);
            }

            await updateUser(userData.id, editedData);
            userData = { ...userData, ...editedData };
            success = "Profile updated successfully";
            isEditing = false;
        } catch (e) {
            error = "Failed to update profile";
        } finally {
            loading = false;
        }
    }

    function getAvatarUrl(userId: string, fileName: string) {
        return `https://maseral-new.pockethost.io/api/files/_pb_users_auth_/${userId}/${fileName}`;
    }

    onMount(async () => {
        userLoggedIn = await isUserLoggedIn();
        try {
            const userId = db.authStore?.model?.id;
            if (userId) {
                loading = true;
                userData = await getUserData(userId);
                editedData = {
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    emailVisibility: userData.emailVisibility,
                    avatar: null
                };
            }
        } catch (e) {
            error = "Failed to load profile";
        } finally {
            loading = false;
        }
    });

    $: if (activeTab === 'favorites' && userData) {
        loadFavoriteContent();
    }
</script>

{#if !userLoggedIn}
<div class="h-screen flex flex-col items-center justify-center px-4" transition:fade={{ duration: 300 }}>
    <div class="text-center max-w-2xl mx-auto">
        <h1 class="text-8xl font-bold mb-4">401</h1>
        <p class="text-xl mb-8 opacity-60">Please log in to view your profile</p>
            
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" class="px-8 py-3 bg-cGray rounded-lg border border-white/10 flex items-center justify-center gap-2">
                <i class="ri-login-circle-line"></i>
                Login
            </a>
            <a href="/register" class="px-8 py-3 bg-cGray rounded-lg border border-white/10 flex items-center justify-center gap-2">
                <i class="ri-user-add-line"></i>
                Register
            </a>
        </div>
    </div>
</div>
{:else if !userData}
<div class="h-screen flex items-center justify-center">
    <i class="ri-loader-4-line animate-spin text-4xl"></i>
</div>
{:else}
<Navbar />

<div class="flex justify-center items-center mt-20 md:mt-0 min-h-[calc(100vh-60px)] px-4 py-8 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        <div class="space-y-6">
            <div class="bg-cGray rounded-xl p-6 border border-white/10">
                <div class="flex flex-col items-center text-center">
                    <div class="w-32 h-32 rounded-full overflow-hidden bg-cLightGray mb-4">
                        {#if userData?.avatar}
                        <img src={getAvatarUrl(userData.id, userData.avatar)} alt="User avatar" class="w-full h-full object-cover" />
                        {:else}
                        <div class="w-full h-full flex items-center justify-center text-4xl opacity-50">
                            <i class="ri-user-line"></i>
                        </div>
                        {/if}
                    </div>
                    <h2 class="text-2xl font-bold flex items-center gap-2">
                        {userData?.name || 'Loading...'}
                        {#if userData?.admin}
                            <div class="relative group">
                                <i class="ri-verified-badge-fill text-white"></i>
                                <div class="absolute z-10 bottom-full left-1/2 font-normal -translate-x-1/2 mb-2 px-2 py-1 text-sm bg-black/90 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    Administrator
                                </div>
                            </div>
                        {/if}
                    </h2>
                    <p class="text-lg opacity-70">@{userData?.username || 'Loading...'}</p>
                    <p class="text-sm opacity-50 mt-1">Joined {new Date(userData?.created || Date.now()).toLocaleDateString()}</p>
                </div>
            </div>

            <div class="bg-cGray rounded-xl overflow-hidden border border-white/10">
                <button class="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-3 {activeTab === 'profile' ? 'bg-white/10' : ''}" on:click={() => activeTab = 'profile'}>
                    <i class="ri-user-settings-line"></i> Profile Settings
                </button>
                <button class="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-3 {activeTab === 'favorites' ? 'bg-white/10' : ''}" on:click={() => activeTab = 'favorites'}>
                    <i class="ri-heart-line"></i> Favorites
                </button>
            </div>
        </div>

        <div class="bg-cGray rounded-xl p-6 border border-white/10">
            {#if activeTab === 'profile'}
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold">Profile Settings</h1>
                {#if !isEditing}
                <button on:click={() => isEditing = true} class="px-4 py-2 bg-cLightGray rounded-lg border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <i class="ri-edit-line"></i> Edit Profile
                </button>
                {/if}
            </div>

            {#if isEditing}
            <form on:submit|preventDefault={handleUpdateProfile} class="space-y-6">
                <div class="flex flex-col items-center gap-4 p-6 bg-black/20 rounded-xl">
                    <div class="relative w-32 h-32 rounded-full overflow-hidden bg-cLightGray group">
                        {#if avatarPreview}
                        <img src={avatarPreview} alt="Avatar preview" class="w-full h-full object-cover" />
                        {:else if userData.avatar}
                        <img src={getAvatarUrl(userData.id, userData.avatar)} alt="Current avatar" class="w-full h-full object-cover" />
                        {:else}
                        <div class="w-full h-full flex items-center justify-center text-4xl opacity-50">
                            <i class="ri-user-line"></i>
                        </div>
                        {/if}

                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label class="cursor-pointer text-sm">
                                <input type="file"  accept="image/*" on:change={handleAvatarChange} class="hidden" />
                                <i class="ri-camera-line mr-2"></i> Change
                            </label>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm opacity-50 mb-1">Username</label>
                        <input type="text" bind:value={editedData.username} class="w-full px-4 py-3 bg-cLightGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
                    </div>

                    <div>
                        <label class="block text-sm opacity-50 mb-1">Email</label>
                        <input type="email" bind:value={editedData.email} class="w-full px-4 py-3 bg-cLightGray rounded-lg border border-white/10 focus:outline-none transition-colors" />
                    </div>
                </div>

                <div class="flex items-center gap-2 p-4 bg-black/20 rounded-lg">
                    <input type="checkbox" id="emailVisibility" bind:checked={editedData.emailVisibility} class="rounded border-white/10" />
                    <label for="emailVisibility" class="text-sm opacity-70">Make email visible to other users</label>
                </div>

                {#if error}
                <div class="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
                {/if}

                {#if success}
                <div class="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                    {success}
                </div>
                {/if}

                <div class="flex items-center gap-4">
                    <button type="submit" disabled={loading} class="px-6 py-3 bg-white text-black rounded-lg font-medium disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                        type="button"
                        on:click={() => {
                            isEditing = false;
                            avatarPreview = null;
                            editedData.avatar = null;
                            }}
                        class="px-6 py-3 bg-cLightGray rounded-lg border border-white/10"
                    >
                    Cancel
                    </button>
                </div>
            </form>
            {:else}
            <div class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="p-4 bg-black/20 rounded-lg">
                        <h3 class="text-sm opacity-50 mb-1">Username</h3>
                        <p class="text-lg">{userData?.username}</p>
                    </div>
                    <div class="p-4 bg-black/20 rounded-lg">
                        <h3 class="text-sm opacity-50 mb-1">Email</h3>
                        <p class="text-lg">{userData?.email}</p>
                    </div>
                    <div class="p-4 bg-black/20 rounded-lg">
                        <h3 class="text-sm opacity-50 mb-1">Email Visibility</h3>
                        <p class="text-lg flex items-center gap-2">
                            <i class={userData?.emailVisibility ? "ri-eye-line" : "ri-eye-off-line"}></i>
                            {userData?.emailVisibility ? 'Public' : 'Private'}
                        </p>
                    </div>
                    <div class="p-4 bg-black/20 rounded-lg">
                        <h3 class="text-sm opacity-50 mb-1">Member Since</h3>
                        <p class="text-lg">{new Date(userData?.created || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            {/if}
            {:else if activeTab === 'favorites'}
            <div class="space-y-6">
                <h1 class="text-2xl font-bold">Favorite Movies</h1>
                    
                {#if loadingFavorites}
                <div class="flex items-center justify-center">
                    <i class="ri-loader-4-line animate-spin text-4xl"></i>
                </div>
                {:else if favoriteMovies.length === 0}
                    <div class="text-center py-12 bg-cGray rounded-xl border border-white/10">
                        <i class="ri-heart-line text-4xl opacity-50 mb-4"></i>
                        <p class="opacity-70">No favorite movies yet</p>
                    </div>
                {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" transition:fade={{ duration: 300 }}>
                    {#each favoriteMovies as content}
                    <div class="relative h-[300px] rounded-lg overflow-hidden">
                        <img src={`https://image.tmdb.org/t/p/original${content.backdrop_path}`} alt={content.title || content.name} class="w-full h-full object-cover brightness-50" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div class="absolute bottom-0 p-4 w-full">
                            <h3 class="text-xl font-bold text-white">{content.title || content.name}</h3>
                            <div class="flex items-center gap-3 text-sm mt-2">
                                <span class="opacity-80">{new Date(content.release_date || content.first_air_date).getFullYear()}</span>
                                <span class="opacity-50">•</span>
                                <span class="opacity-80"><i class="ri-heart-fill"></i> {content.vote_average.toFixed(1)}</span>
                                <span class="opacity-50">•</span>
                                <span class="opacity-80">{content.contentType === 'series' ? 'Series' : 'Movie'}</span>
                            </div>
                            <div class="flex items-center gap-3 mt-4">
                                <button on:click={() => goto(`/${content.contentType === 'series' ? 'series' : 'movie'}/${content.id}`)} class="bg-white text-black px-4 py-2 rounded-lg">
                                    Watch {content.contentType === 'series' ? 'Series' : 'Movie'}
                                </button>
                                <button on:click={() => handleRemoveFavorite(content.id)} class="bg-red-500 text-white px-4 py-2 rounded-lg">
                                    <i class="ri-heart-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
                {/if}
            </div>
            {/if}
        </div>
    </div>
</div>

<Footer />
{/if}