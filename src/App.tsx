import { Navigate, Route, Routes } from 'react-router'
import Auth from './pages/Auth'
import Dashboard from './layout/Dashboard'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Tables from './pages/Tables'
import { ThemeProvider } from './components/theme-provider'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './pages/Login'
import { Toaster } from './components/ui/sonner'
import OrdersTakeAway from './pages/OrdersTakeAway.tsx'
import OrdersCounter from './pages/OrdersCounter.tsx'
import OrdersTable from './pages/OrdersTable.tsx'
import ViewAccount from './pages/ViewAccount'
import Kitchen from './pages/Kitchen'
import SelectRestaurant from "@/pages/SelectRestaurant.tsx";
import SelectRestaurantGuard from "@/utils/SelectRestaurantGuard.tsx";
import TablesOrder from './pages/TablesOrder'
import WaiterView from "@/pages/WaiterView.tsx";
import PayPage from "@/pages/PayPage.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <Toaster richColors closeButton />
            <Routes>

                {/* Públicas */}
                <Route path="/" element={<MainLayout />}>

                    <Route index element={<Navigate to="/login" replace />} />
                    <Route path="register" element={<Auth />} />
                    <Route path="login" element={<Login />} />
                </Route>

                {/* Requieren autenticación */}
                <Route element={<ProtectedRoute requireRestaurant={false} />}>
                    <Route
                        path="/select-restaurant"
                        element={
                            <SelectRestaurantGuard>
                                <SelectRestaurant />
                            </SelectRestaurantGuard>
                        }
                    />
                </Route>

                {/* Requieren restaurante seleccionado */}
                <Route element={<ProtectedRoute requireRestaurant />}>
                    <Route path="/dashboard" element={<Dashboard />}>

                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<Home />} />
                        <Route path="restaurants" element={<Restaurants />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="products" element={<Products />} />
                        <Route path='tables' element={<Tables />} />

                        <Route path="orders">
                            <Route path="tables" element={<TablesOrder />} />
                            <Route path="counter" element={<OrdersCounter />} />
                            <Route path="delivery" element={<OrdersTakeAway />} />
                            <Route path="takeOrder" element={<OrdersTable />} />
                            <Route path="viewAccount" element={<ViewAccount />} />
                            <Route path="kitchen" element={<Kitchen />} />
                            <Route path="waiter" element={<WaiterView />} />
                            <Route path="pay/:tableId" element={<PayPage />} />
                        </Route>
                    </Route>
                </Route>

            </Routes>
        </ThemeProvider>
    )
}

export default App
