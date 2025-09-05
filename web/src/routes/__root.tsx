import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import Header from '@/components/Header'

export const Route = createRootRoute({
    component: () => (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Header />
                    <Outlet />
                </SidebarInset>
                <TanstackDevtools
                    config={{
                        position: 'bottom-left',
                    }}
                    plugins={[
                        {
                            name: 'Tanstack Router',
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />
            </SidebarProvider>
        </>
    ),
})
