import { Routes, Route, Navigate } from 'react-router'
import Auth from './pages/Auth'
import Dashboard from './layout/Dashboard'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Orders from './pages/Orders'
import { ThemeProvider } from './components/theme-provider'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './pages/Login'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster richColors closeButton />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/register" replace />} />
          <Route path="register" element={<Auth />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App
