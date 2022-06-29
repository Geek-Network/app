import { Dialog, Transition } from '@headlessui/react';
import { ChainId, Token } from '@sushiswap/core-sdk';
import { Fragment } from 'react';

import { MdAutorenew, MdClose, MdImage } from 'react-icons/md';
import { Field } from '../constants';
import useSwap from '../hooks/useSwap';
import { useDispatch } from '../store';
import { hide } from '../store/modal';

export default function SelectToken({ field }: { field: Field }) {
    const dispatch = useDispatch();

    const close = () => dispatch(hide());

    const { onCurrencySelection } = useSwap();

    const tokens = [
        new Token(ChainId.RINKEBY, '0xA7dE33d5af924FEa80016faC97aF3162a3979a08', 18, 'GEEK'),
        new Token(ChainId.RINKEBY, '0xf41f2dee55f8acdb0eea3404a1b55a982c276ac8', 18, 'USDT'),
        new Token(ChainId.RINKEBY, '0x5f71368d05f3f04cc3A739f88779A41D635c9C45', 18, 'MKT'),
    ];

    const onSelect = (token: Token) => {
        // dispatch({ type: 'token', data: token, isBase });
        onCurrencySelection(field, token);
        close();
    };

    const loading = false;

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={close}>
                <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-black/20 transition-opacity" />
                    </Transition.Child>
                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <Dialog.Panel className="inline-block w-full max-w-2xl transform overflow-hidden rounded-md bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 dark:text-gray-200 sm:my-8 sm:align-middle">
                        {/* Head */}
                        <div className="bg-gray-50 p-4 dark:bg-gray-600 sm:px-6">
                            <div className="flex items-start justify-between">
                                <h2 className="text-lg font-medium">Select a Token</h2>
                                <div className="ml-3 flex h-7 items-center">
                                    <button onClick={close} tabIndex={-1} className="rounded text-gray-400 transition hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <span className="sr-only">Close panel</span>
                                        <MdClose className="h-6 w-6"></MdClose>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 px-6 py-4">
                            <div className="relative flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-gray-300 p-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                                />

                                {/* <button
                                    type="button"
                                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md bg-indigo-500 px-4 py-2 text-sm font-medium text-gray-100 transition hover:bg-indigo-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    {loading ? <MdClose className="h-5 w-5" /> : <MdAutorenew className="h-5 w-5" />}
                                </button> */}

                                <div className="absolute inset-y-0 right-1 flex items-center">
                                    <button
                                        type="button"
                                        className="-ml-py inline-flex items-center rounded p-2 text-sm font-medium transition hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                        {loading ? <MdClose className="h-5 w-5" /> : <MdAutorenew className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div></div>

                            {tokens.map((t) => (
                                <div key={t.address} onClick={() => onSelect(t)} className="group flex cursor-pointer items-center rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <MdImage className="mr-2 h-6 w-6" /> {t.symbol}
                                </div>
                            ))}

                            <div>
                                <button>Manage Token Lists</button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
