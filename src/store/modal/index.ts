import { createAction, createSlice } from '@reduxjs/toolkit';
export interface ModalState {
    data: (string | any)[] | null;
}

const initialState: ModalState = {
    data: null,
};

export default createSlice({
    name: 'modal',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(show, (state, { payload }) => {
                state.data = payload;
            })
            .addCase(hide, (state) => {
                state.data = null;
            });
    },
});

export const show = createAction<ModalState['data']>('modal/show');
export const hide = createAction('modal/hide');
