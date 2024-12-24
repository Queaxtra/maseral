import db from "./db";

interface FavoriteMovieData {
    filmId: string;
    userId: string;
    type?: string;
}

export async function addFavorite(filmId: string, userId: string, type?: string) {
    try {
        const data: FavoriteMovieData = {
            filmId,
            userId,
            type
        };
        const record = await db.collection('favorites').create(data);
        return record;
    } catch (error) {
        throw new Error('Failed to add favorite');
    }
}

export async function removeFavorite(filmId: string, userId: string) {
    try {
        const record = await db.collection('favorites').getFirstListItem(
            `filmId="${filmId}" && userId="${userId}"`
        );
        if (record) {
            await db.collection('favorites').delete(record.id);
        }
        return true;
    } catch (error) {
        throw new Error('Failed to remove favorite');
    }
}

export async function isMovieFavorited(filmId: string, userId: string) {
    try {
        const record = await db.collection('favorites').getFirstListItem(
            `filmId="${filmId}" && userId="${userId}"`
        );
        return record ? true : false;
    } catch (error) {
        return false;
    }
}

export async function getUserFavorites(userId: string) {
    try {
        const records = await db.collection('favorites').getList(1, 50, {
            filter: `userId="${userId}"`,
        });
        return records.items;
    } catch (error) {
        throw new Error('Failed to get user favorites');
    }
}