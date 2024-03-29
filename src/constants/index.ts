import { JSBI, Percent } from '@sushiswap/core-sdk';

export * from './network';

// export enum Field {
//     FROM,
//     TO,
// }

export enum Field {
    INPUT,
    OUTPUT,
}

export const MAX_HOPS = 3;

// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30;

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));

export const ZERO_PERCENT = new Percent('0');

export const ONE_HUNDRED_PERCENT = new Percent('1');

export const GLOBAL_DEFAULT_SLIPPAGE_PERCENT = new Percent(50, 10_000) // .5%
export const GLOBAL_DEFAULT_SLIPPAGE_STR = GLOBAL_DEFAULT_SLIPPAGE_PERCENT.toFixed(2)


export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const USER_REJECTED_TX = 4001;