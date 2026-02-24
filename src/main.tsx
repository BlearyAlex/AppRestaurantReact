import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import './index.css'
import App from './App.tsx'
import {SignalRProvider} from './contexts/SignalRContext.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <SignalRProvider>
                    <App/>
                </SignalRProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)
