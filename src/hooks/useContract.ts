import { ROUTER_ADDRESS } from '@sushiswap/core-sdk';
import { Contract, Signer } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useContract, useNetwork, useSigner } from 'wagmi';
import { ADDRESS_ZERO } from '../constants';

import ROUTER_ABI from '../constants/abis/router.json';

// account is optional
// export function getContract(address: string, ABI: any, signer?: any): Contract {
//     if (!isAddress(address) || address === ADDRESS_ZERO) {
//         throw Error(`Invalid 'address' parameter '${address}'.`);
//     }
//     return new Contract(address, ABI, signer);
// }

// export function useContract<T extends Contract = Contract>(addressOrAddressMap: string | { [chainId: number]: string } | undefined, ABI: any, withSignerIfPossible = true): T | null {
//     // const { library, account, chainId } = useActiveWeb3React();

//     const { chain } = useNetwork();

//     const signer = useSigner();

//     return useMemo(() => {
//         if (!addressOrAddressMap || !ABI || !chain) return null;
//         let address: string | undefined;
//         if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
//         else address = addressOrAddressMap[chain.id];
//         if (!address) return null;

//         try {
//             return getContract(address, ABI, withSignerIfPossible && signer.isFetched ? signer : undefined);
//         } catch (error) {
//             console.error('Failed to get contract', error);
//             return null;
//         }
//     }, [addressOrAddressMap, ABI, chain, withSignerIfPossible, signer]) as T;
// }

export function useRouterContract(): Contract | null {
    const { chain } = useNetwork();
    if (!chain) return null;

    return useContract({
        addressOrName: ROUTER_ADDRESS[chain.id],
        contractInterface: ROUTER_ABI,
    });

    //  useContract(ROUTER_ADDRESS[chain.id], ROUTER_ABI, withSignerIfPossible);
}
