import { classNames } from '@morioh/helper';
import { useCallback, useState } from 'react';
import { MdHistoryToggleOff, MdShare, MdSwapVert, MdTune } from 'react-icons/md';
import { Field } from '../../constants';
import useSwap from '../../hooks/useSwap';

import { RootState, useSelector } from '../../store';
import CurrencyInput from './input';

export default function Swap() {
    const { currencies } = useSelector((state: RootState) => state.swap);

    const { onChangeRecipient, onSwitchCurrencies, onCurrencySelection, onChangeAmount } = useSwap();

    const [a, setA] = useState(0);
    const [b, setB] = useState(0);

    const shiff = () => {
        onSwitchCurrencies();
        setA(b);
        setB(0);
    };

    const onInputChange = useCallback(
        (value: number) => {
            onChangeAmount(Field.INPUT, value);
            setA(value);
        },
        [onChangeAmount]
    );

    const onOutputChange = useCallback(
        (value: number) => {
            onChangeAmount(Field.OUTPUT, value);
            setB(value);
        },
        [onChangeAmount]
    );

    // console.log(currencies);

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

                        <CurrencyInput field={Field.INPUT} currency={currencies[0]} value={a} onChange={(val) => onInputChange(val)}></CurrencyInput>

                        <div className="flex justify-center">
                            <button type="button" onClick={shiff} className="rounded p-2 transition hover:bg-gray-200 dark:hover:bg-opacity-20">
                                <MdSwapVert className="h-5 w-5"></MdSwapVert>
                            </button>
                        </div>

                        <CurrencyInput field={Field.OUTPUT} currency={currencies[1]} value={b} onChange={(val) => onOutputChange(val)}></CurrencyInput>

                        <div>
                            <button type="submit" disabled={loading} className={classNames(loading ? 'animate-pulse' : '', 'btn w-full')}>
                                Connect to Wallet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
