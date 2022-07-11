import { RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { Interface } from 'ethers/lib/utils';
import { useContractReads, useEnsResolver, useProvider, useSendTransaction } from 'wagmi';

import IUniswapV2PairABI from '@sushiswap/core/build/abi/IUniswapV2Pair.json';
import { BigNumber } from 'ethers';

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

export default function Dashboard() {
    // const { data, isError, isLoading } = useContractReads({
    //     contracts: [
    //         {
    //             addressOrName: '0x06da0fd433c1a5d7a4faa01111c044910a184553',
    //             contractInterface: PAIR_INTERFACE,
    //             functionName: 'getReserves',
    //         },
    //         {
    //             addressOrName: '0x397ff1542f962076d0bfe58ea045ffa2d347aca0',
    //             contractInterface: PAIR_INTERFACE,
    //             functionName: 'getReserves',
    //         },
    //     ],
    // });

    //const provider = useProvider();

    // provider.estimateGas({ to: '0xdD1e3E58b91eC3919A2ca7b9ec7f46eAC7981D75', value: BigNumber.from('1000000000000000000') }).then((val) => {
    //     console.log(val.toNumber());
    // });

    const { data, isIdle, isError, isLoading, isSuccess, sendTransaction } = useSendTransaction({
        request: {
            to: '0x1463FFA15A654c82BE1F73d54Ba50999283A39aB',
            value: BigNumber.from('900000000000000000'), // 1 ETH
        },
    });

    return (
        <div>
            <div className="mt-8 mb-4 inline-block bg-gradient-to-r from-blue-500 via-violet-500 to-orange-500 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">Light as a feather.</div>

            <div>
                {isIdle && (
                    <button disabled={isLoading} onClick={() => sendTransaction()}>
                        Send Transaction
                    </button>
                )}
                {isLoading && <div>Check Wallet</div>}
                {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
                {isError && <div>Error sending transaction</div>}
            </div>
        </div>
    );

    // return (
    //     <>
    //         <div className="mt-8 mb-4 inline-block bg-gradient-to-r from-blue-500 via-violet-500 to-orange-500 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">Light as a feather.</div>

    //         {/* <button
    //             type="button"
    //             onClick={() => dispatch(increment())}
    //             className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
    //             Count
    //         </button> */}
    //     </>
    // );
}
