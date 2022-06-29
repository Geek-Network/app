import { RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../store/counter';

export default function Dashboard() {
    
    const dispatch = useDispatch();

    return (
        <>
            <div className="mt-8 mb-4 inline-block bg-gradient-to-r from-blue-500 via-violet-500 to-orange-500 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">Light as a feather.</div>

         

            {/* <button
                type="button"
                onClick={() => dispatch(increment())}
                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Count
            </button> */}
        </>
    );
}
