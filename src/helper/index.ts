import { parseUnits } from '@ethersproject/units';
import { ChainId, Currency, CurrencyAmount, JSBI, NATIVE, Percent, Token, Trade, TradeType } from '@sushiswap/core-sdk';
import { ONE_HUNDRED_PERCENT } from '../constants';
import { DEFAULT_LIST_OF_LISTS } from '../constants/token-lists';

export function shorted(value: string | null | undefined) {
    if (value) return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
    else return '';
}

/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
export function uriToHttp(uri: string): string[] {
    // console.log(uri);

    const protocol = uri.split(':')[0].toLowerCase();
    switch (protocol) {
        case 'https':
            return [uri];
        case 'http':
            return ['https' + uri.substr(4), uri];
        case 'ipfs':
            const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
            return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`];
        case 'ipns':
            const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
            return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`];
        default:
            return [];
    }
}

export function parseBalance(value: string, decimals = 18) {
    return parseUnits(value || '0', decimals);
}

// try to parse a user entered amount for a given token
export function tryParseAmount<T extends Currency>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
    if (!value || !currency) {
        return undefined;
    }
    try {
        const typedValueParsed = parseUnits(value, currency.decimals).toString();
        if (typedValueParsed !== '0') {
            return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed));
        }
    } catch (error) {
        // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
        console.debug(`Failed to parse input amount: "${value}"`, error);
    }
    // necessary for all paths to return a value
    return undefined;
}

// use ordering of default list of lists to assign priority
export function sortByListPriority(urlA: string, urlB: string) {
    const first = DEFAULT_LIST_OF_LISTS.includes(urlA) ? DEFAULT_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER;
    const second = DEFAULT_LIST_OF_LISTS.includes(urlB) ? DEFAULT_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER;

    // need reverse order to make sure mapping includes top priority last
    if (first < second) return 1;
    else if (first > second) return -1;
    return 0;
}

export function computeFiatValuePriceImpact(fiatValueInput: CurrencyAmount<Token> | undefined | null, fiatValueOutput: CurrencyAmount<Token> | undefined | null): Percent | undefined {
    if (!fiatValueOutput || !fiatValueInput) return undefined;
    if (!fiatValueInput.currency.equals(fiatValueOutput.currency)) return undefined;
    if (JSBI.equal(fiatValueInput.quotient, JSBI.BigInt(0))) return undefined;
    const pct = ONE_HUNDRED_PERCENT.subtract(fiatValueOutput.divide(fiatValueInput));
    return new Percent(pct.numerator, pct.denominator);
}

const THIRTY_BIPS_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000));

const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(THIRTY_BIPS_FEE);

export const ZERO_PERCENT = new Percent('0');

// computes realized lp fee as a percent
export function computeRealizedLPFeePercent(trade: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>): Percent {
    let percent: Percent = ZERO_PERCENT;
    if (trade instanceof Trade) {
        // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
        // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
        percent = ONE_HUNDRED_PERCENT.subtract(trade.route.pairs.reduce<Percent>((currentFee: Percent): Percent => currentFee.multiply(INPUT_FRACTION_AFTER_FEE), ONE_HUNDRED_PERCENT));
    }
    return new Percent(percent.numerator, percent.denominator);
}

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string): boolean {
    return /^0x0*$/.test(hexNumberString);
}
