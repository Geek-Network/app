import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { lazy, useEffect } from 'react';

import { RootState, useSelector } from './store';

const Layout = lazy(() => import('./layout'));
const Dashboard = lazy(() => import('./components/dashboard'));
const Swap = lazy(() => import('./components/swap'));
const _404 = lazy(() => import('./components/_404'));

import Modals from './components/modals';

// import Updater from './store/list/updater';

export default function App() {
    const isDark = useSelector((state: RootState) => state.user.isDark);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);    

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/swap" element={<Swap />} />

                        <Route path="*" element={<_404 />} />
                    </Route>
                </Routes>
                <Modals />
                {/* <Updater></Updater> */}
            </BrowserRouter>
        </>
    );
}

// export const PrivateRoute = ({ redirect = '/login', ...props }) => {
//     const { user } = useAuth()

//     return user ? <Route {...props} /> : <Navigate to={redirect} />
// }
