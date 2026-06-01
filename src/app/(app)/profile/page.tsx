"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
    const { data: session } = useSession()

    const user = session?.user

    return (
        <div className="mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage
                        src={user?.image || ""} />
                    <AvatarFallback>
                        {user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h1 className="text-2xl font-semibold">
                        {user?.name ?? "Guest User"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {user?.email ?? "No email available"}
                    </p>
                </div>
            </div>

            <Separator />

            {/* TABS */}
            <Tabs defaultValue="account" className="w-full">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                {/* ACCOUNT */}
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Full Name</Label>
                                <Input value={user?.name ?? ""} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">Email</Label>
                                <Input value={user?.email ?? ""} />
                            </div>

                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm">New Password</Label>
                                <Input type="password" placeholder="••••••••" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">Confirm Password</Label>
                                <Input type="password" placeholder="••••••••" />
                            </div>

                            <Button>Update Password</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BILLING */}
                <TabsContent value="billing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Manage your subscription and payment methods.
                            </p>

                            <Button variant="outline">
                                Manage Subscription
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
