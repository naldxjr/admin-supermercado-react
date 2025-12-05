import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Products } from '../pages/Products'
import { Promotions } from '../pages/Promotions'
import { Users } from '../pages/Users'
import { UserDetail } from '../pages/UserDetail'
import { ProtectedRoute } from './ProtectedRoute'
import { Layout } from '../components/Layout'
import { Clients } from '../pages/Clients'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {

        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),

        children: [
            {
                path: '/',
                element: <Products />,
            },
            {
                path: '/products',
                element: <Products />,
            },
            {
                path: '/promotions',
                element: <Promotions />,
            },
            {
                path: '/users',
                element: <Users />,
            },
            {
                path: '/user/:id',
                element: <UserDetail />,
            },
            {
                path: '/clients',
                element: <Clients />,
            },
        ],
    },
])

export function AppRoutes() {
    return <RouterProvider router={router} />
}