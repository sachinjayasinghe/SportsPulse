import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

interface User {
    id: string;
    username: string;
    email: string;
    token: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
};

// Async thunk to restore token from SecureStore
export const restoreToken = createAsyncThunk('auth/restoreToken', async () => {
    try {
        const userString = await SecureStore.getItemAsync('user_session');
        if (userString) {
            return JSON.parse(userString) as User;
        }
        return null;
    } catch (e) {
        console.error('Failed to restore token', e);
        return null;
    }
});

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            // DUMMY API CALL
            // In a real app, you would fetch from an API here.
            // Simulating network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (credentials.username && credentials.password) {
                const mockUser: User = {
                    id: '1',
                    username: credentials.username,
                    email: `${credentials.username}@example.com`,
                    token: 'dummy-jwt-token',
                };
                await SecureStore.setItemAsync('user_session', JSON.stringify(mockUser));
                return mockUser;
            } else {
                return rejectWithValue('Invalid credentials');
            }
        } catch (error) {
            return rejectWithValue('Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await SecureStore.deleteItemAsync('user_session');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Restore Token
            .addCase(restoreToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(restoreToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(restoreToken.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export default authSlice.reducer;
