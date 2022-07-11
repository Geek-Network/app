import { useState } from 'react';
import { useProvider } from 'wagmi';
import { RootState, useSelector } from '../store';

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export default function useTransactionDeadline(): number | undefined {
    const [deadline, setDeadline] = useState<number>();
    const ttl = useSelector((state: RootState) => state.user.deadline);
    const provider = useProvider();

    provider.getBlock(-1).then((block) => {
        setDeadline(block.timestamp + ttl);
    });

    return deadline;
}
