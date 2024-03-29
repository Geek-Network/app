import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../helper/auth'

export default function Authenticated({ children }: { children: JSX.Element }) {
    let { user } = useAuth()
    let location = useLocation()

    // console.log(user)

    // if (!user) {
    //     // Redirect them to the /login page, but save the current location they were
    //     // trying to go to when they were redirected. This allows us to send them
    //     // along to that page after they login, which is a nicer user experience
    //     // than dropping them off on the home page.
    //     return <Navigate to="/login" state={{ from: location }} replace />

    //     //return "Login";
    // }

    return user ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
}
