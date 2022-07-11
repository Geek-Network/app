import { TransactionRequest } from '@ethersproject/providers';
import { Currency, Percent, Router, SwapParameters, toHex, Trade, TradeType } from '@sushiswap/core-sdk';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useAccount, useEnsAddress, useNetwork, useProvider, useSendTransaction, useSigner } from 'wagmi';
import { USER_REJECTED_TX } from '../constants';
import { isZero } from '../helper';
import { calculateGasMargin } from '../helper/trade';
import { RootState, useDispatch, useSelector } from '../store';
import { TransactionResponseLight } from '../store/transaction';
import { useRouterContract } from './useContract';
import useTransactionDeadline from './useTransactionDeadline';

export enum SwapCallbackState {
    INVALID,
    LOADING,
    VALID,
}

interface SwapCall {
    address: string;
    calldata: string;
    value: string;
}

interface SwapCallEstimate {
    call: SwapCall;
}

export interface SuccessfulCall extends SwapCallEstimate {
    call: SwapCall;
    gasEstimate: BigNumber;
}

interface FailedCall extends SwapCallEstimate {
    call: SwapCall;
    error: Error;
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 * @param tridentTradeContext context for a trident trade that contains boolean flags on whether to spend from wallet and/or receive to wallet
 */
export function useSwapCallArguments(
    trade: Trade<Currency, Currency, TradeType> | undefined | null, // trade to execute, required
    allowedSlippage: Percent, // in bips
    recipient: string | undefined // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
    //const { account, chainId, library } = useActiveWeb3React();

    //const { address } = useAccount();

    // const { address: recipientAddress } = useENS(recipientAddressOrName);
    // const recipient = recipientAddressOrName === null ? account : recipientAddress;

    //const recipient = recipientAddressOrName ?? address;

    const deadline = useTransactionDeadline();

    const RouterContract = useRouterContract();

    return useMemo<SwapCall[]>(() => {
        let result: SwapCall[] = [];

        if (!trade || !recipient || !RouterContract || !deadline) return result;

        const swapMethods: SwapParameters[] = [];
        swapMethods.push(
            Router.swapCallParameters(trade, {
                feeOnTransfer: false,
                allowedSlippage,
                recipient,
                deadline,
            })
        );

        if (trade.tradeType === TradeType.EXACT_INPUT) {
            swapMethods.push(
                Router.swapCallParameters(trade, {
                    feeOnTransfer: true,
                    allowedSlippage,
                    recipient,
                    deadline: deadline,
                })
            );
        }

        result = swapMethods.map(({ methodName, args, value }) => {
            return {
                address: RouterContract.address,
                calldata: RouterContract.interface.encodeFunctionData(methodName, args),
                value,
            };
        });

        return result;
    }, [allowedSlippage, deadline, RouterContract, recipient, trade]);
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
    trade: Trade<Currency, Currency, TradeType> | undefined | null, // trade to execute, required
    allowedSlippage: Percent, // in bips
    recipientAddressOrName: string | undefined // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): {
    state: SwapCallbackState;
    callback: null | (() => Promise<string>);
    error: string | null;
} {
    const { address: account } = useAccount();

    const provider = useProvider();
    // const { data: signer } = useSigner();

    //const { account, chainId, library } = useActiveWeb3React();
    // const blockNumber = useBlockNumber();
    // const dispatch = useDispatch();
    // const { maxFee, maxPriorityFee } = useSelector((state: RootState) => state.swap);
    // const { expertMode } = useSelector((state: RootState) => state.user);

    // const eip1559 =
    //     // @ts-ignore TYPE NEEDS FIXING
    //     EIP_1559_ACTIVATION_BLOCK[chainId] == undefined ? false : blockNumber >= EIP_1559_ACTIVATION_BLOCK[chainId];

    // const { address: recipientAddress } = useENS(recipientAddressOrName);

    const { data: ensAddress } = useEnsAddress({ name: recipientAddressOrName });

    const recipient = recipientAddressOrName ? ensAddress ?? undefined : account ?? undefined;

    const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipient);

    const { sendTransactionAsync } = useSendTransaction();

    return useMemo(() => {
        if (!trade || !account) {
            return {
                state: SwapCallbackState.INVALID,
                callback: null,
                error: 'Missing dependencies',
            };
        }
        if (!recipient) {
            if (recipientAddressOrName !== null) {
                return {
                    state: SwapCallbackState.INVALID,
                    callback: null,
                    error: 'Invalid recipient',
                };
            } else {
                return {
                    state: SwapCallbackState.LOADING,
                    callback: null,
                    error: null,
                };
            }
        }

        return {
            state: SwapCallbackState.VALID,
            callback: async function onSwap(): Promise<string> {
                console.log('onSwap callback', swapCalls);
                const estimatedCalls: SwapCallEstimate[] = await Promise.all(
                    swapCalls.map((call) => {
                        const { address, calldata, value } = call;

                        const tx =
                            !value || isZero(value)
                                ? { from: account, to: address, data: calldata }
                                : {
                                      from: account,
                                      to: address,
                                      data: calldata,
                                      value,
                                  };

                        console.log('SWAP TRANSACTION', { tx, value });

                        return provider
                            .estimateGas(tx)
                            .then((gasEstimate) => {
                                console.log('returning gas estimate');
                                return {
                                    call,
                                    gasEstimate,
                                };
                            })
                            .catch((gasError) => {
                                console.debug('Gas estimate failed, trying eth_call to extract error', call);

                                return provider
                                    .call(tx)
                                    .then((result) => {
                                        console.debug('Unexpected successful call after failed estimate gas', call, gasError, result);
                                        return {
                                            call,
                                            error: new Error('Unexpected issue with estimating the gas. Please try again.'),
                                        };
                                    })
                                    .catch((callError) => {
                                        console.debug('Call threw error', call, callError);
                                        return {
                                            call,
                                            error: callError,

                                            //error: new Error(swapErrorToUserReadableMessage(callError)),
                                        };
                                    });
                            });
                    })
                );

                // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
                let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
                    (el, ix, list): el is SuccessfulCall => 'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
                );

                console.log('Estimate', bestCallOption, estimatedCalls);

                // check if any calls errored with a recognizable error
                if (!bestCallOption) {
                    const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call);
                    if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
                    const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>((call): call is SwapCallEstimate => !('error' in call));
                    if (!firstNoErrorCall) throw new Error('Unexpected error. Could not estimate gas for the swap.');
                    bestCallOption = firstNoErrorCall;
                }

                const {
                    call: { address, calldata, value },
                } = bestCallOption;

                console.log('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {});

                const request: TransactionRequest = {
                    from: account,
                    to: address,
                    data: calldata,
                    // let the wallet try if we can't estimate the gas
                    ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
                    // gasPrice: !eip1559 && chainId === ChainId.HARMONY ? BigNumber.from('2000000000') : undefined,
                    ...(value && !isZero(value) ? { value } : {}),
                };

                const txResponse = sendTransactionAsync({ request });
                //provider.sendTransaction()

                // const txResponse = signer.sendTransaction(request);

                // let privateTx = false;
                // let txResponse: Promise<TransactionResponseLight> = provider.sendTransaction(request)  //provider.getSigner().sendTransaction(txParams);

                // const { data, isIdle, isError, isLoading, isSuccess, sendTransaction } = useSendTransaction({ request });

                return txResponse
                    .then((response) => {
                        const base = `Swap ${trade?.inputAmount?.toSignificant(4)} ${trade?.inputAmount.currency?.symbol} for ${trade?.outputAmount?.toSignificant(4)} ${trade?.outputAmount.currency?.symbol}`;

                        console.log(base);

                        // const withRecipient = recipient === account ? base : `${base} to ${recipientAddressOrName && isAddress(recipientAddressOrName) ? (recipientAddressOrName) : recipientAddressOrName}`;

                        // addTransaction(response, {
                        //     summary: withRecipient,
                        //     privateTx,
                        //   })

                        return response.hash;
                    })
                    .catch((error) => {
                        // if the user rejected the tx, pass this along
                        if (error?.code === USER_REJECTED_TX) {
                            throw new Error('Transaction rejected.');
                        } else {
                            // otherwise, the error was unexpected and we need to convey that
                            console.error(`Swap failed`, error, address, calldata, value);

                            throw new Error(`Swap failed: ${error}`);
                        }
                    });
            },
            error: null,
        };
    }, [trade, account, recipient, recipientAddressOrName, swapCalls, sendTransactionAsync, provider]);
}
