import { classNames } from '@morioh/helper';
import { useCallback, useMemo, useState } from 'react';
import { MdHistoryToggleOff, MdOutlineMultipleStop, MdShare, MdSwapVert, MdTune } from 'react-icons/md';
import { Field } from '../../constants';

import { RootState, useSelector } from '../../store';
import CurrencyInput from './input';

import { computeRealizedLPFeePercent } from '../../helper';
import useSwap, { useSlippageTolerance } from '../../store/swap/hooks';
import { useContract, useProvider } from 'wagmi';
import { useSwapCallback } from '../../hooks/useSwapCallback';

export default function Swap() {
    // const singleHopOnly = useSelector((state:RootState)=>state.user.singleHopOnly);
    // const { amount, field } = useSelector((state: RootState) => state.swap);

    const { onSwitchCurrencies, onChangeAmount, trade, currencies, amounts } = useSwap();

    // console.log('byUrl', byUrl);

    //console.log('swap', JSON.stringify( trade, null, '\t'));

    // console.log('trade', trade?.inputAmount.toExact(), trade?.outputAmount.toExact(), trade?.priceImpact.toFixed());

    const shiff = () => {
        onSwitchCurrencies();
    };

    const onInputChange = useCallback(
        (value: number) => {
            onChangeAmount(Field.INPUT, value);
        },
        [onChangeAmount]
    );

    const onOutputChange = useCallback(
        (value: number) => {
            onChangeAmount(Field.OUTPUT, value);
        },
        [onChangeAmount]
    );

    // console.log(currencies);

    const priceImpact = useMemo(() => {
        if (trade) {
            const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
            const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent);
            return priceImpact;
        }
        return 0;
    }, [trade]);

    // const minReceived = minimumAmountOut || trade?.minimumAmountOut(allowedSlippage)
    const realizedLpFeePercent = trade ? computeRealizedLPFeePercent(trade) : undefined;

    const allowedSlippage = useSlippageTolerance();

    const minReceived = trade?.minimumAmountOut(allowedSlippage);

    const [inverted, setInverted] = useState(false);

    // the callback to execute the swap
    const { callback: swapCallback, error } = useSwapCallback(trade, allowedSlippage, undefined);

    const handleSwap = useCallback(() => {
        if (!swapCallback) {
            return;
        }

        swapCallback()
            .then((hash) => {
                console.log(hash);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [swapCallback]);

    const loading = false;

    return (
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="rounded-md bg-white py-6 px-4 shadow dark:bg-gray-800">
                    <form className="space-y-4" autoComplete="off">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold">Swap</h3>
                            <div className="space-x-2">
                                <button type="button" className="inline-flex items-center rounded p-2 transition hover:bg-gray-200 dark:hover:bg-opacity-20">
                                    <MdHistoryToggleOff className="h-6 w-6" />
                                </button>
                                <button type="button" className="inline-flex items-center rounded p-2 transition hover:bg-gray-200 dark:hover:bg-opacity-20">
                                    <MdTune className="h-6 w-6" />
                                </button>
                                <button type="button" className="inline-flex items-center rounded p-2 transition hover:bg-gray-200 dark:hover:bg-opacity-20">
                                    <MdShare className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <CurrencyInput field={Field.INPUT} currency={currencies[0]} value={amounts[0]} onChange={(val) => onInputChange(val)}></CurrencyInput>

                        <div className="flex justify-center">
                            <button type="button" onClick={shiff} className="rounded p-2 transition hover:bg-gray-200 dark:hover:bg-opacity-20">
                                <MdSwapVert className="h-5 w-5"></MdSwapVert>
                            </button>
                        </div>

                        <CurrencyInput field={Field.OUTPUT} currency={currencies[1]} value={amounts[1]} onChange={(val) => onOutputChange(val)}></CurrencyInput>

                        {trade && (
                            <button type="button" onClick={() => setInverted(!inverted)} className="flex w-full items-center justify-center space-x-2 text-sm">
                                <span>1 {inverted ? trade.executionPrice.quoteCurrency.symbol : trade.executionPrice.baseCurrency.symbol}</span>
                                <MdOutlineMultipleStop className="h-4 w-4"></MdOutlineMultipleStop>
                                <span>
                                    {inverted ? trade.executionPrice.invert().toSignificant(4) : trade.executionPrice.toSignificant(4)}{' '}
                                    {inverted ? trade.executionPrice.baseCurrency.symbol : trade.executionPrice.quoteCurrency.symbol}
                                </span>
                            </button>
                        )}
                        <div>
                            <button type="button" onClick={handleSwap} className={classNames(loading ? 'animate-pulse' : '', 'btn w-full')}>
                                Swap
                            </button>
                        </div>

                        {trade && (
                            <div className="space-y-2 rounded-md bg-gray-100 p-4 text-xs dark:bg-gray-900">
                                <div className="flex justify-between">
                                    <span>Minimum received:</span>
                                    <span>
                                        {minReceived?.toSignificant(6)} {minReceived?.currency.symbol}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Slippage:</span>
                                    <span> {allowedSlippage.toFixed(2)}%</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Price Impact:</span>
                                    <span> {priceImpact.toFixed()}%</span>
                                </div>

                                {realizedLpFeePercent && (
                                    <div className="flex justify-between">
                                        <span>Liquidity Provider Fee:</span>
                                        <span> {realizedLpFeePercent.toFixed(2)}%</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Route:</span>
                                    <span> {trade.route.path.map((el) => el.symbol).join(' > ')}</span>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
