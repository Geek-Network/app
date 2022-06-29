import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// const Navbar = lazy(() => import('./components/navbar'));
import Navbar from './components/navbar';
// const Sidebar = lazy(() => import('./components/sidebar'));

export default function Layout() {
    return (
        <>
            <Navbar />

            <div className="flex flex-col">
                <main className="flex-1">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                            <Suspense>
                                <Outlet />
                            </Suspense>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
