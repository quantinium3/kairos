import BannerCarousel from '@/components/banner'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: App,
})

function App() {
    return (
        <div className="w-full h-[600px] overflow-hidden relative">
            <BannerCarousel />
        </div>
    )
}
