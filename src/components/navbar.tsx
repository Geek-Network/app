import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { MdMoreVert, MdOutlineAutoStories, MdExpandMore, MdAutorenew, MdDarkMode, MdLightMode, MdCheck } from 'react-icons/md';

import { useAccount, useConnect, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';

import { shorted } from '../helper';

import { toKb } from '@morioh/helper';
import { RootState, useDispatch, useSelector } from '../store';
import { toggleMode } from '../store/dark';
import { show } from '../store/modal';

export default function Navbar() {
    const dispatch = useDispatch();

    const { address, isConnected, connector } = useAccount();

    const { data: balance, isLoading } = useBalance({ addressOrName: address, watch: true });

    const { connect, connectors } = useConnect();

    const { chain } = useNetwork();

    const { chains, switchNetwork } = useSwitchNetwork();

    const info = () => dispatch(show(['account']));

    const isDark = useSelector((state: RootState) => state.mode.isDark);

    return (
        <div className="fixed top-0 z-20 w-full bg-white shadow transition dark:bg-gray-800 dark:text-gray-100">
            <div className="w-full px-2 pl-0 sm:px-4">
                <div className="relative flex h-15 items-center justify-between space-x-4">
                    <div className="flex items-center">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-indigo-500">
                            <Link to="/">
                                <span className="sr-only">Workflow</span>
                                {/* <img className="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" /> */}

                                <svg className="h-8 w-auto text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 695.92 790">
                                    <path
                                        d="M251.05,287.24c-8.81-29.83,3.07-63.93,34.24-81,9.76-5.36,20.94-7.66,32.08-7.66h0a69.12,69.12,0,1,1-32.2,130.29,70.05,70.05,0,0,1-9-5.63c-90.68,56.36-169.38,121-224,182.39v69.93a43.93,43.93,0,0,0,22,38l304,175.54a44,44,0,0,0,43.92,0l42.64-24.62c-58.84-56.34-118.92-131.45-171.38-216.24a69,69,0,1,1,36.06-25c53.93,87.51,115.6,164,174.67,218.52l222-128.2a43.93,43.93,0,0,0,22-38V352.11C694.2,405.65,625.7,459.56,549.25,507.27a69,69,0,1,1-25.14-36c90.68-56.37,169.38-121,224-182.39V224.46a43.9,43.9,0,0,0-22-38L422.1,10.88a43.93,43.93,0,0,0-43.91,0l-39.88,23c59.38,56.51,120.1,132.24,173.05,217.83a69.1,69.1,0,1,1-41.74,34,68.07,68.07,0,0,1,5.67-9C420.85,188.38,358.5,111.3,298.9,56.67L74.15,186.43a43.9,43.9,0,0,0-22,38V442.4C106.11,388.87,174.6,335,251.05,287.24Z"
                                        transform="translate(-52.19 -5)"
                                        style={{ fillRule: 'evenodd' }}
                                    />
                                    <path
                                        d="M519.74,338.7a23,23,0,0,0,10.9,2.73,23.34,23.34,0,0,0,11-43.95,23,23,0,0,0-10.91-2.73,23.33,23.33,0,0,0-11,43.95Z"
                                        transform="translate(-52.19 -5)"
                                        style={{ fillRule: 'evenodd' }}
                                    />
                                    <path d="M274.08,458.58A23.33,23.33,0,1,0,285,461.3,23.31,23.31,0,0,0,274.08,458.58Z" transform="translate(-52.19 -5)" style={{ fillRule: 'evenodd' }} />
                                    <path d="M493.85,506.19A23,23,0,0,0,483,503.5a23.37,23.37,0,1,0,10.84,2.69Z" transform="translate(-52.19 -5)" style={{ fillRule: 'evenodd' }} />
                                    <path d="M317.29,291a23.34,23.34,0,1,0-10.83-2.68A23.06,23.06,0,0,0,317.29,291Z" transform="translate(-52.19 -5)" style={{ fillRule: 'evenodd' }} />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="hidden flex-1 justify-start md:flex">
                        <div className="flex space-x-2">
                            <Link to="/swap" className="rounded px-4 py-2 font-normal transition hover:bg-gray-100 dark:hover:bg-opacity-20">
                                Swap
                            </Link>

                            <Link to="/staking" className="rounded px-4 py-2 font-normal transition hover:bg-gray-100 dark:hover:bg-opacity-20">
                                Staking
                            </Link>

                            <Link to="/startup" className="rounded px-4 py-2 font-normal transition hover:bg-gray-100 dark:hover:bg-opacity-20">
                                Startup
                            </Link>
                            <Link to="/airdrop" className="rounded px-4 py-2 font-normal transition hover:bg-gray-100 dark:hover:bg-opacity-20">
                                Airdrop
                            </Link>

                            <Link to="/marketplace" className="rounded px-4 py-2 font-normal transition hover:bg-gray-100 dark:hover:bg-opacity-20">
                                NFT
                            </Link>
                            <Link to="/payment" className="rounded px-4 py-2 font-normal transition hover:bg-gray-100 dark:hover:bg-opacity-20">
                                Merchant
                            </Link>

                            {/* 
                            <a href="" className="rounded px-4 py-2 font-normal transition hover:bg-gray-700 hover:text-white">
                                Earn
                            </a>
                            <a href="" className="cursor-pointer rounded border border-indigo-500 px-4 py-2 font-normal transition hover:bg-indigo-500 focus:outline-none focus:ring">
                                Locked
                            </a> */}
                        </div>
                    </div>

                    <div className="ml-3 flex items-center space-x-4">
                        {isConnected ? (
                            <>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="inline-flex w-full items-center justify-center rounded border border-gray-300 py-2 px-4 text-sm transition hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-opacity-30 dark:hover:border-opacity-100">
                                            {chain && <span>{chain.name}</span>}
                                            <MdExpandMore className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95">
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow focus:outline-none dark:divide-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                            <div className="p-1">
                                                {chains.map((x) => (
                                                    <Menu.Item disabled={!switchNetwork || x.id === chain?.id} key={x.id} onClick={() => switchNetwork?.(x.id)}>
                                                        <a href="#" className="group flex cursor-pointer justify-between rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            <span>{x.name}</span>
                                                            {x.id === chain?.id && <MdCheck className="h-5 w-5 text-indigo-500"></MdCheck>}
                                                        </a>
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>

                                <div className="flex flex-shrink-0 space-x-6 self-center">
                                    <span className="relative z-0 inline-flex rounded-md">
                                        <button
                                            type="button"
                                            disabled
                                            className="relative inline-flex items-center rounded-l border border-gray-300  px-3 py-2 text-sm font-medium focus:z-10 focus:outline-none dark:border-opacity-30 dark:hover:border-opacity-100">
                                            {isLoading && <MdAutorenew className="h-5 w-5 animate-spin"></MdAutorenew>}
                                            {toKb(parseFloat(balance?.formatted), 4)} {balance?.symbol}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={info}
                                            className="relative -ml-px inline-flex items-center rounded-r border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium hover:border-indigo-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-opacity-30 dark:bg-gray-700 dark:hover:border-opacity-100">
                                            {shorted(address)}
                                        </button>
                                    </span>
                                </div>

                                {/* <button className="relative flex-shrink-0 rounded bg-white bg-opacity-20 p-2 text-sm transition hover:bg-opacity-50 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-50 focus:ring-opacity-90">
                                    {parseFloat(formatEther(ethBalance)).toPrecision(4)}
                                </button>

                                <button className="relative flex-shrink-0 rounded bg-gray-300 bg-opacity-20 p-2 text-sm transition hover:bg-opacity-50 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-50 focus:ring-opacity-90">
                                    {shorted(account)}
                                </button> */}

                                <Menu as="div" className="relative inline-block">
                                    <Menu.Button className="relative flex-shrink-0 rounded-md border border-gray-300 p-2 transition hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-90 dark:border-opacity-30 dark:hover:border-opacity-100">
                                        <span className="sr-only">Open options</span>
                                        <MdMoreVert className="h-5 w-5"></MdMoreVert>
                                    </Menu.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95">
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow focus:outline-none dark:divide-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                            {/* <div className="py-1">

                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a href="https://geek.gl" target="_blank" rel="noreferrer" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex p-2 text-sm')}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
                                                                <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6l3-4zm11.386 3.785-1.806-2.41-.776 2.413 2.582-.003zm-3.633.004.961-2.989H4.186l.963 2.995 5.704-.006zM5.47 5.495 8 13.366l2.532-7.876-5.062.005zm-1.371-.999-.78-2.422-1.818 2.425 2.598-.003zM1.499 5.5l5.113 6.817-2.192-6.82L1.5 5.5zm7.889 6.817 5.123-6.83-2.928.002-2.195 6.828z" />
                                                            </svg>

                                                            <span>What is GEEK?</span>
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div> */}

                                            <div className="p-1">
                                                <Menu.Item>
                                                    <a className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <MdOutlineAutoStories className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"></MdOutlineAutoStories>

                                                        <span>Docs</span>
                                                    </a>
                                                </Menu.Item>
                                            </div>

                                            <div className="p-1">
                                                {isDark ? (
                                                    <Menu.Item>
                                                        <a onClick={() => dispatch(toggleMode())} className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            <MdDarkMode className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"></MdDarkMode>
                                                            <span>Appearance: Dark</span>
                                                        </a>
                                                    </Menu.Item>
                                                ) : (
                                                    <Menu.Item>
                                                        <a onClick={() => dispatch(toggleMode())} className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            <MdLightMode className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"></MdLightMode>
                                                            <span>Appearance: Light</span>
                                                        </a>
                                                    </Menu.Item>
                                                )}
                                            </div>

                                            {/* <div className="p-1">
                                                {isDark ? (
                                                    <Menu.Item>
                                                        <a onClick={() => setDarkMode(false)} className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            <MdDarkMode className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"></MdDarkMode>
                                                            <span>Appearance: Dark</span>
                                                        </a>
                                                    </Menu.Item>
                                                ) : (
                                                    <Menu.Item>
                                                        <a onClick={() => setDarkMode(true)} className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                            <MdLightMode className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"></MdLightMode>
                                                            <span>Appearance: Light</span>
                                                        </a>
                                                    </Menu.Item>
                                                )}
                                            </div> */}

                                            <div className="p-1">
                                                <Menu.Item>
                                                    <a href="#" className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                                        </svg>

                                                        <span>Get in touch</span>
                                                    </a>
                                                </Menu.Item>

                                                <Menu.Item>
                                                    <a href="/about/terms" className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                                                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                                                        </svg>

                                                        <span>Terms of use</span>
                                                    </a>
                                                </Menu.Item>

                                                <Menu.Item>
                                                    <a href="/about/privacy" className="group flex cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                                                            <path d="M7.001 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z" />
                                                        </svg>
                                                        <span>Privacy policy</span>
                                                    </a>
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </>
                        ) : (
                            <button onClick={() => connect({ connector: connectors[0] })} className="ml-3 flex-shrink-0 rounded-md border border-indigo-500 px-4 py-2 transition hover:bg-indigo-500 hover:text-white">
                                Connect
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
