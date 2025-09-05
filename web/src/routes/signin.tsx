import SignIn from '@/components/sign-in'
import { SignUp } from '@/components/sign-up'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        <div className="flex justify-center py-10 md:px-10">
            <div className="flex w-full max-w-md flex-col gap-5">
                <Tabs defaultValue="signin">
                    <TabsList>
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                        <SignIn />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignUp />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
}
