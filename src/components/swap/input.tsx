import { debounce, toKb } from '@morioh/helper';
import { Currency } from '@sushiswap/core-sdk';
import { memo } from 'react';
import { MdExpandMore, MdOutlineAccountBalanceWallet } from 'react-icons/md';

import { useAccount, useBalance } from 'wagmi';
import { Field } from '../../constants';
import { useDispatch } from '../../store';
import { show } from '../../store/modal';

export default function CurrencyInput({ field, currency, value, onChange }: { field: Field; currency: Currency | undefined; value: string | number | undefined; onChange: (value: number) => void }) {
    const dispatch = useDispatch();

    const { address } = useAccount();

    const { data: balance, isLoading } = useBalance({
        addressOrName: address,
        token: currency?.isToken ? currency.address : undefined,
    });

    const selectToken = () => dispatch(show(['selectToken', { field }]));

    const onInputChange = (e: any) => debounce(onChange(e.target.value.replace(/,/g, '.')), 800);

    const onPercent = (p: number) => onChange(balance && balance.value.gt(0) ? (parseFloat(balance.formatted) * p) / 100 : 0);

    return (
        <div className="space-y-4 rounded-md bg-gray-100 p-4 dark:bg-gray-900">
            <div className="flex justify-between">
                <div className="inline-flex items-center text-sm"> {field === Field.INPUT ? 'Send' : 'Receive'}:</div>
                <div className="inline-flex items-center space-x-2 text-sm">
                    <MdOutlineAccountBalanceWallet className="h-4 w-4" />
                    <span>{currency && balance ? toKb(parseFloat(balance.formatted), 6) : '0.00'}</span>
                </div>
            </div>

            <div className="relative mt-4 flex rounded-md shadow-sm">
                <input
                    type="text"
                    value={value || ''}
                    placeholder="0.00"
                    onChange={onInputChange}
                    className="block w-full rounded-md border border-gray-300 p-2.5 pr-24 text-sm font-medium transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                />

                <div className="absolute inset-y-0 right-1 flex items-center">
                    <button
                        type="button"
                        onClick={selectToken}
                        className="-ml-py inline-flex items-center rounded px-3 py-2 text-sm font-medium transition hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        {currency ? currency.symbol : 'Select a token'} <MdExpandMore className="-mr-1 ml-1 h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {field === Field.INPUT && (
                <div className="flex justify-between">
                    {[10, 25, 50, 75, 100].map((p) => (
                        <button
                            type="button"
                            key={p}
                            onClick={() => onPercent(p)}
                            className="rounded bg-white py-1 px-4 text-sm transition hover:bg-indigo-500 hover:text-white dark:bg-opacity-20 dark:hover:bg-opacity-100">
                            {p}%
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
