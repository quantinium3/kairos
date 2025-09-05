import { 
    Home, 
    Search, 
    Settings, 
    Film, 
    Tv, 
    Music, 
    BookOpen, 
    FolderOpen, 
    Star, 
    Clock, 
    Download, 
    Users, 
    PlayCircle 
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

const mediaItems = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Movies",
        url: "#",
        icon: Film,
        subItems: [
            { title: "All Movies", url: "#" },
            { title: "Recently Added", url: "#" },
            { title: "Favorites", url: "#" },
            { title: "Genres", url: "#" }
        ]
    },
    {
        title: "TV Shows",
        url: "#",
        icon: Tv,
        subItems: [
            { title: "All Shows", url: "#" },
            { title: "Continue Watching", url: "#" },
            { title: "Next Up", url: "#" },
            { title: "Latest Episodes", url: "#" }
        ]
    },
    {
        title: "Anime",
        url: "#",
        icon: PlayCircle,
        subItems: [
            { title: "All Anime", url: "#" },
            { title: "Currently Airing", url: "#" },
            { title: "Completed", url: "#" },
            { title: "Plan to Watch", url: "#" }
        ]
    },
    {
        title: "Music",
        url: "#",
        icon: Music,
        subItems: [
            { title: "Artists", url: "#" },
            { title: "Albums", url: "#" },
            { title: "Playlists", url: "#" },
            { title: "Recently Played", url: "#" }
        ]
    },
    {
        title: "Books",
        url: "#",
        icon: BookOpen,
        subItems: [
            { title: "All Books", url: "#" },
            { title: "Audiobooks", url: "#" },
            { title: "Reading List", url: "#" },
            { title: "Authors", url: "#" }
        ]
    }
]

const libraryItems = [
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Favorites",
        url: "#",
        icon: Star,
    },
    {
        title: "Recently Watched",
        url: "#",
        icon: Clock,
    },
    {
        title: "Downloads",
        url: "#",
        icon: Download,
    }
]

const adminItems = [
    {
        title: "Users",
        url: "#",
        icon: Users,
    },
    {
        title: "Libraries",
        url: "#",
        icon: FolderOpen,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    }
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mediaItems.map((item) => (
                                item.subItems ? (
                                    <Collapsible key={item.title} className="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subItems.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <a href={subItem.url}>{subItem.title}</a>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {libraryItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
