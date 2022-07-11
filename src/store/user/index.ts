import { createAction, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_DEADLINE_FROM_NOW, GLOBAL_DEFAULT_SLIPPAGE_STR } from '../../constants';

export interface UserState {
    isDark: boolean;

    expertMode: boolean;

    // deadline set by user in minutes, used in all txns
    deadline: number;

    // only allow swaps on direct pairs
    singleHopOnly: boolean;
    
    slippage: string;
}

const initialState: UserState = {
    isDark: false,
    expertMode: false,
    singleHopOnly: false,
    deadline: DEFAULT_DEADLINE_FROM_NOW,
    slippage: GLOBAL_DEFAULT_SLIPPAGE_STR,
};

export default createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleSingleHopOnly, (state) => {
                state.singleHopOnly = !state.singleHopOnly;
            })
            .addCase(toggleeExpertMode, (state) => {
                state.expertMode = !state.expertMode;
            })
            .addCase(toggleMode, (state) => {
                state.isDark = !state.isDark;
            })
            .addCase(setSlippage, (state, { payload }) => {
                state.slippage = payload;
            })
            .addCase(setDeadline, (state, { payload }) => {
                state.deadline = payload;
            });
    },
});

export const toggleMode = createAction('user/toggleMode');
export const toggleSingleHopOnly = createAction('user/singleHopOnly');
export const toggleeExpertMode = createAction('user/expertMode');
export const setDeadline = createAction<UserState['deadline']>('user/deadline');
export const setSlippage = createAction<UserState['slippage']>('user/slippage');
