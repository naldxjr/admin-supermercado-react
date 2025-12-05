import { AppRoutes } from './routes'
import { AuthProvider } from './contexts/AuthContext'
import { ProductProvider } from './contexts/ProductContext'
import { UserProvider } from './contexts/UserContext'
import { ClientProvider } from './contexts/ClientContext'
import { ToastProvider } from './contexts/ToastContext' 

function App() {
  return (
    <ToastProvider> 
        <AuthProvider>
          <ProductProvider>
            <UserProvider>
              <ClientProvider>
                 <AppRoutes />
              </ClientProvider>
            </UserProvider>
          </ProductProvider>
        </AuthProvider>
    </ToastProvider>
  )
}
export default App