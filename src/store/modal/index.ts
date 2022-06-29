import { createSlice } from '@reduxjs/toolkit';
export interface ModalState {
    //show: boolean;
    data: [] | null;
}

const initialState: ModalState = {
    data: null,
};

export const ModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        show: (state, { payload }) => {
            state.data = payload;
        },

        hide: (state) => {
            state.data = null;
        },
    },
});

// Action creators are generated for each case reducer function
export const { show, hide } = ModalSlice.actions;

export const ModalReducer = ModalSlice.reducer;
