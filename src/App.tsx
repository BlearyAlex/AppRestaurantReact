import { Navigate, Route, Routes } from 'react-router'
import Auth from './features/auth/pages/Auth'
import Dashboard from './layout/Dashboard'
import MainLayout from './layout/MainLayout'
import Home from './features/restaurant/pages/Home'
import Restaurants from './features/restaurant/pages/Restaurants'
import Categories from './features/categories/pages/Categories'
import Products from './features/products/pages/Products'
import Tables from './features/tables/pages/Tables'
import { ThemeProvider } from './components/common/theme-provider'
import ProtectedRoute from './utils/guards/ProtectedRoute'
import Login from './features/auth/pages/Login'
import { Toaster } from './components/ui/sonner'
import OrdersTakeAway from './features/orders/pages/OrdersTakeAway.tsx'
import OrdersCounter from './features/orders/pages/OrdersCounter.tsx'
import OrdersTable from './features/orders/pages/OrdersTable.tsx'
import ViewAccount from './features/restaurant/pages/ViewAccount'
import Kitchen from './features/orders/pages/Kitchen'
import SelectRestaurant from "@/features/restaurant/pages/SelectRestaurant.tsx";
import SelectRestaurantGuard from "@/features/restaurant/components/SelectRestaurantGuard.tsx";
import TablesOrder from './features/tables/pages/TablesOrder'
import WaiterView from "@/features/orders/pages/WaiterView.tsx";
import PayPage from "@/features/payment/pages/PayPage.tsx";
import CashRegisters from './features/cashRegister/pages/CashRegister.tsx'
import CashRegisterSession from './features/cashRegister/pages/CashRegisterSession.tsx'

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
                        <Route path='cashRegisterSessions' element={<CashRegisterSession />} />
                        <Route path='cashRegister' element={<CashRegisters />} />

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
