/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction, createSlice } from '@reduxjs/toolkit';
import { Currency } from '@sushiswap/core-sdk';
import { Field } from '../../constants';

export interface SwapState {
    field: Field;
    currencies: (Currency | undefined)[];
    amount?: number;
    recipient?: string;
    maxFee?: string;
    maxPriorityFee?: string;   
}

const initialState: SwapState = {
    field: Field.INPUT,
    amount: 10,
    currencies: [undefined, undefined], 
    recipient: undefined,
    maxFee: undefined,
    maxPriorityFee: undefined   
};


export default createSlice({
    name: 'swap',
    initialState,
    reducers: {},
    // "builder callback API", recommended for TypeScript users
    extraReducers: (builder) => {
        // builder.addCase(incrementBy, (state, action) => {
        //     return state + action.payload;
        // });
        // builder.addCase(decrementBy, (state, action) => {
        //     return state - action.payload;
        // });

        builder
            .addCase(setCurrency, (state, { payload: { field, currency } }) => {
                state.currencies[field === Field.INPUT ? 0 : 1] = currency;
            })
            .addCase(setCurrencies, (state, { payload }) => {
                state.currencies = payload;
            })
            .addCase(switchCurrencies, (state) => {
                state.field = state.field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
                state.currencies = state.currencies.reverse();
            })
            .addCase(setAmount, (state, { payload: { field, amount } }) => {
                state.field = field;
                state.amount = amount;
            })
            .addCase(setFees, (state, { payload: { maxFee, maxPriorityFee } }) => {
                state.maxFee = maxFee;
                state.maxPriorityFee = maxPriorityFee;
            })
            .addCase(setMaxFee, (state, { payload }) => {
                state.maxFee = payload;
            })
            .addCase(setPriorityFee, (state, { payload }) => {
                state.maxPriorityFee = payload;
            })          
            .addCase(setRecipient, (state, { payload }) => {
                state.recipient = payload;
            });
    },
});

export const setCurrency = createAction<any>('swap/setCurrency');
export const setCurrencies = createAction<SwapState['currencies']>('swap/setCurrencies');
export const switchCurrencies = createAction('swap/switchCurrencies');
export const setAmount = createAction<SwapState>('swap/setAmount');
export const setRecipient = createAction<SwapState['recipient']>('swap/setRecipient');
export const setFees = createAction<SwapState>('swap/setFees');
export const setMaxFee = createAction<SwapState['maxFee']>('swap/setMaxFee');
export const setPriorityFee = createAction<SwapState['maxPriorityFee']>('swap/setPriorityFee');