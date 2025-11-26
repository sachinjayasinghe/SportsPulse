import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Reusing the interface from Home, but ideally should be in a shared types file
interface SportEvent {
    idEvent: string;
    strEvent: string;
    strThumb: string;
    strStatus: string;
    dateEvent: string;
    strLeague: string;
}

interface FavoritesState {
    items: SportEvent[];
    isLoading: boolean;
}

const initialState: FavoritesState = {
    items: [],
    isLoading: true,
};

export const loadFavorites = createAsyncThunk('favorites/load', async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@favorites');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load favorites', e);
        return [];
    }
});

export const toggleFavorite = createAsyncThunk(
    'favorites/toggle',
    async (item: SportEvent, { getState }) => {
        const state = getState() as any;
        const currentFavorites = state.favorites.items as SportEvent[];
        const isFavorite = currentFavorites.some((fav) => String(fav.idEvent) === String(item.idEvent));

        let newFavorites;
        if (isFavorite) {
            newFavorites = currentFavorites.filter((fav) => String(fav.idEvent) !== String(item.idEvent));
        } else {
            newFavorites = [...currentFavorites, item];
        }

        await AsyncStorage.setItem('@favorites', JSON.stringify(newFavorites));
        return newFavorites;
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadFavorites.fulfilled, (state, action) => {
                state.items = action.payload;
                state.isLoading = false;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.items = action.payload;
            });
    },
});

export default favoritesSlice.reducer;
