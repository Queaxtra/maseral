import db from "./db";

interface UserRegistrationData {
    password: string;
    passwordConfirm: string;
    name: string;
    username: string;
    email: string;
    emailVisibility: boolean;
    admin: boolean;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface UpdateUserData {
    name?: string;
    username?: string;
    email?: string;
    emailVisibility?: boolean;
    avatar?: File | null;
}

export async function registerUser(userData: UserRegistrationData) {
    try {
        const record = await db.collection('users').create(userData);
        return record;
    } catch (error) {
        throw error;
    }
}

export async function loginUser(credentials: LoginCredentials) {
    try {
        const authData = await db.collection('users').authWithPassword(credentials.email, credentials.password);
        return authData;
    } catch (error) {
        throw error;
    }
}

export async function getUserData(userId: string) {
    try {
        const userData = await db.collection('users').getOne(userId);
        return userData;
    } catch (error) {
        throw error;
    }
}

export async function logoutUser() {
    try {
        await db.authStore.clear();
    } catch (error) {
        throw error;
    }
}

export async function isUserLoggedIn() {
    return await db.authStore.isValid;
}

export const updateUser = async (userId: string, updateData: UpdateUserData): Promise<any> => {
    try {
        const record = await db.collection('users').update(userId, updateData);
        return record;
    } catch (error) {
        throw new Error('Failed to update user');
    }
};

export async function getUserByUsername(username: string) {
    try {
        const record = await db.collection('users').getFirstListItem(`username="${username}"`);
        return record;
    } catch (error) {
        return null;
    }
}