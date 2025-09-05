import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useNavigate } from '@tanstack/react-router'
import { SidebarTrigger } from './ui/sidebar'
import { Button } from './ui/button'
import { NAME } from '@/consts'
import { authClient } from '@/lib/auth-client';

export default function Header() {
    const { data: session } = authClient.useSession();
    const navigate = useNavigate();

    return (
        <header className="p-2 flex gap-2 text-black justify-between items-center border-b w-full">
            <nav className="flex flex-row">
                <SidebarTrigger />
                <div className="px-2 font-bold flex justify-between">
                    <Link to="/">{NAME}</Link>
                </div>
            </nav>
            {session ? (
                <div className="flex gap-3">
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={session ? session?.user.image as string : "https://github.com/quantinium3"} />
                                    <AvatarFallback>{session?.user.name}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => authClient.signOut()}>Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ) : (
                <Button onClick={() => navigate({ to: "/signin" })}>
                    Sign In
                </Button>
            )}
        </header>
    )
}
