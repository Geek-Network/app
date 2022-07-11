import { Currency, JSBI, Percent, Router, SwapParameters, Trade, TradeType } from '@sushiswap/core-sdk';
import { Contract } from 'ethers';
import { useMemo } from 'react';
import { BIPS_BASE } from '../constants';
import useTransactionDeadline from './useTransactionDeadline';

interface SwapCall {
    contract: Contract;
    parameters: SwapParameters;
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
    trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
    allowedSlippage: Percent, // in bips
    recipientAddress: string | null // the address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
    const { account, chainId, library } = useActiveWeb3React();

    const recipient = recipientAddress === null ? account : recipientAddress;
    const deadline = useTransactionDeadline();

    return useMemo(() => {
        if (!trade || !recipient || !library || !account || !chainId || !deadline) return [];

        const contract = getRouterContract(chainId, library, account);
        if (!contract) {
            return [];
        }

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
                    deadline,
                })
            );
        }

        return swapMethods.map((parameters) => ({ parameters, contract }));
    }, [account, allowedSlippage, chainId, deadline, library, recipient, trade]);
}
