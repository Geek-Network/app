import React from 'react';

import { RootState, useSelector } from '../store';

import Account from './account';
import SelectToken from './select-token';

const Components = {
    account: Account,
    selectToken: SelectToken,
};

export default function Modals() {
    const data = useSelector((state: RootState) => state.modal.data);

    if (data && Components[data[0]]) {
        // const Comopnent = Components[data[0]];
        // return <Comopnent {...data[1]} />
        return React.createElement(Components[data[0]], data[1]);
    }

    return null;
}
