import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { MdClose, MdContentCopy, MdCheck } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { useAccount, useDisconnect } from 'wagmi';
import useClipboard from '../hooks/useClipboard';
import { hide } from '../store/modal';

export default function Account() {
    const dispatch = useDispatch();

    const { address } = useAccount();

    const { disconnect } = useDisconnect({
        onSuccess: () => {
            close();
        },
    });

    const [isCopied, toClipboard] = useClipboard();

    const close = () => dispatch(hide());

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={close}>
                <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20 transition-opacity" />
                    </Transition.Child>
                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <Dialog.Panel className="inline-block w-full max-w-2xl transform overflow-hidden rounded-md bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 dark:text-gray-200 sm:my-8 sm:align-middle">
                        {/* Head */}
                        <div className="bg-gray-50 p-4 dark:bg-gray-600 sm:px-6">
                            <div className="flex items-start justify-between">
                                <h2 className="text-lg font-medium">Account</h2>
                                <div className="ml-3 flex h-7 items-center">
                                    <button onClick={close} tabIndex={-1} className="rounded text-gray-400 transition hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <span className="sr-only">Close panel</span>
                                        <MdClose className="h-6 w-6"></MdClose>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 px-6 py-4">
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    readOnly
                                    value={address}
                                    className="block w-full rounded-none rounded-l-md border-gray-300 p-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                                />
                                {/* block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm */}

                                <button
                                    type="button"
                                    onClick={() => toClipboard(address)}
                                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md bg-indigo-500 px-4 py-2 text-sm font-medium text-gray-100 transition hover:bg-indigo-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    {isCopied ? <MdCheck className="h-5 w-5"></MdCheck> : <MdContentCopy className="h-5 w-5"></MdContentCopy>}
                                </button>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={() => disconnect()}
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
