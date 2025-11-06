import { AppRoutes } from './routes'
// import { AuthProvider } from './contexts/AuthContext'
// import { ProductProvider } from './contexts/ProductContext'
// import { UserProvider } from './contexts/UserContext'

function App() {
  return (
    // <AuthProvider>
    //   <ProductProvider>
    //     <UserProvider>
    <AppRoutes />
    //     </UserProvider>
    //   </ProductProvider>
    // </AuthProvider>
  )
}

export default App