import { createSlice } from '@reduxjs/toolkit';
import { Currency } from '@sushiswap/core-sdk';
import { Field } from '../constants';
export interface SwapState {
    field: Field;
    // [Field.INPUT]: Currency | undefined;
    // [Field.OUTPUT]: Currency | undefined;
    currencies: (Currency | undefined)[];
    amount?: number;
    recipient?: string;
    maxFee?: string;
    maxPriorityFee?: string;
    singleHopOnly: boolean;
}

const initialState: SwapState = {
    field: Field.INPUT,
    amount: undefined,
    currencies: [undefined, undefined],
    // [Field.INPUT]: undefined,
    // [Field.OUTPUT]: undefined,

    recipient: undefined,
    maxFee: undefined,
    maxPriorityFee: undefined,
    singleHopOnly: false,
};

export const SwapSlice = createSlice({
    name: 'swap',
    initialState,
    reducers: {
        setCurrency: (state, { payload: { field, currency } }) => {
            //state[field] = currency;
            state.currencies[field === Field.INPUT ? 0 : 1] = currency;

            // console.log(field, currency, state.currencies);
        },

        setCurrencies: (state, { payload }) => {
            state.currencies = payload;
        },

        switchCurrencies: (state) => {
            // state.field = state.field === Field.INPUT ? Field.OUTPUT : Field.OUTPUT;
            // state[Field.INPUT] = state[Field.OUTPUT];
            // state[Field.OUTPUT] = state[Field.INPUT];
            state.currencies = state.currencies.reverse();
        },

        setAmount: (state, { payload: { field, amount } }) => {
            state.field = field;
            state.amount = amount;
        },

        setRecipient: (state, { payload: recipient }) => {
            state.recipient = recipient;
        },

        setFees: (state, { payload: { maxFee, maxPriorityFee } }) => {
            state.maxFee = maxFee;
            state.maxPriorityFee = maxPriorityFee;
        },

        setMaxFee: (state, { payload: maxFee }) => {
            state.maxFee = maxFee;
        },

        setPriorityFee: (state, { payload: maxPriorityFee }) => {
            state.maxPriorityFee = maxPriorityFee;
        },

        toggleSingleHopOnly: (state) => {
            state.singleHopOnly = !state.singleHopOnly;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setFees, setMaxFee, setPriorityFee, switchCurrencies, setAmount, setCurrency, setCurrencies, setRecipient, toggleSingleHopOnly } = SwapSlice.actions;

export const SwapReducer = SwapSlice.reducer;
