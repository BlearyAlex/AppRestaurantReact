import {Navigate, Route, Routes} from 'react-router'
import Auth from './pages/Auth'
import Dashboard from './layout/Dashboard'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Tables from './pages/Tables'
import {ThemeProvider} from './components/theme-provider'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './pages/Login'
import {Toaster} from './components/ui/sonner'
import Delivery from './pages/Delivery'
import Counter from './pages/Counter'
import Orders from './pages/Orders'
import ViewAccount from './pages/ViewAccount'
import Kitchen from './pages/Kitchen'
import SelectRestaurant from "@/pages/SelectRestaurant.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <Toaster richColors closeButton/>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<Navigate to="/register" replace/>}/>
                    <Route path="register" element={<Auth/>}/>
                    <Route path="login" element={<Login/>}/>

                    {/* No necesita ProtectedRoute: el componente valida el router state */}
                    <Route path="select-restaurant" element={<SelectRestaurant/>}/>
                </Route>

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/dashboard" element={<Dashboard/>}>

                        {/* index del dashboard */}
                        <Route index element={<Navigate to="home" replace/>}/>

                        <Route path="home" element={<Home/>}/>
                        <Route path="restaurants" element={<Restaurants/>}/>
                        <Route path="categories" element={<Categories/>}/>
                        <Route path="products" element={<Products/>}/>

                        <Route path="orders">
                            <Route path="tables" element={<Tables/>}/>
                            <Route path="counter" element={<Counter/>}/>
                            <Route path="delivery" element={<Delivery/>}/>
                            <Route path="takeOrder" element={<Orders/>}/>
                            <Route path="viewAccount" element={<ViewAccount/>}/>
                            <Route path="kitchen" element={<Kitchen/>}/>
                        </Route>

                    </Route>
                </Route>

            </Routes>
        </ThemeProvider>
    )
}

export default App
