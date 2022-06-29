import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface DarkModeState {
    isDark: boolean;
}

const initialState: DarkModeState = {
    isDark: false,
};

export const ModeSlice = createSlice({
    name: 'mode',
    initialState,
    reducers: {
        toggleMode: (state) => {
            state.isDark = !state.isDark;
        },
    },
});

// Action creators are generated for each case reducer function
export const { toggleMode } = ModeSlice.actions;

// export const selectMode = (state) => state.counter.value

export const ModeReducer = ModeSlice.reducer;
