"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { Mail, Heart, Edit, Save, XCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
}

export default function ProfilePage() {
  const { favorites } = useSubscription();
  const { toast } = useToast();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedAvatar, setEditedAvatar] = useState("");

  useEffect(() => {
    // This runs on the client, after hydration
    const loggedIn = localStorage.getItem('cookai_loggedIn');
    if (loggedIn !== 'true') {
        router.push('/login');
        return;
    }

    const storedUser = localStorage.getItem('cookai_user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditedName(parsedUser.name);
        setEditedEmail(parsedUser.email);
        setEditedAvatar(parsedUser.avatar || "https://github.com/shadcn.png");
    }
  }, [router]);


  const handleEditToggle = () => {
    if (user) {
        setIsEditing(!isEditing);
        if (!isEditing) {
            // entering edit mode
            setEditedName(user.name);
            setEditedEmail(user.email);
            setEditedAvatar(user.avatar);
        }
    }
  };

  const handleSaveChanges = () => {
    const updatedUser = { name: editedName, email: editedEmail, avatar: editedAvatar };
    setUser(updatedUser);
    localStorage.setItem('cookai_user', JSON.stringify(updatedUser));
    setIsEditing(false);
    toast({
        title: "تم حفظ التغييرات",
        description: "تم تحديث معلومات ملفك الشخصي بنجاح.",
    });
    // Force header update
    window.dispatchEvent(new Event("storage"));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cookai_loggedIn');
    localStorage.removeItem('cookai_user'); // Optional: clear user data on logout
    toast({ title: "تم تسجيل الخروج بنجاح."});
    router.push('/login');
     // Force header update
    window.dispatchEvent(new Event("storage"));
  };

  if (!user) {
      // Still loading from localStorage or redirecting
      return null;
  }

  return (
    <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="flex flex-col md:flex-row items-center gap-6 space-y-0 p-6">
                 <div className="relative group">
                    <Avatar className="h-24 w-24 mb-4 md:mb-0">
                        <AvatarImage src={isEditing ? editedAvatar : user.avatar} alt={user.name} />
                        <AvatarFallback>{(isEditing ? editedName : user.name).charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <>
                            <Label htmlFor="avatar-upload" className="absolute bottom-4 -right-2 cursor-pointer bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-opacity duration-300">
                                <Edit className="h-4 w-4" />
                            </Label>
                            <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </>
                    )}
                </div>
                <div className="flex-grow text-center md:text-right">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input id="email" type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                            </div>
                        </div>
                    ) : (
                         <div>
                            <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </p>
                        </div>
                    )}
                </div>
                 <div className="flex flex-col sm:flex-row gap-2 self-start md:self-center">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSaveChanges}><Save className="ml-2 h-4 w-4" /> حفظ</Button>
                            <Button variant="outline" onClick={handleEditToggle}><XCircle className="ml-2 h-4 w-4" /> إلغاء</Button>
                        </>
                    ) : (
                        <>
                           <Button variant="outline" onClick={handleEditToggle}><Edit className="ml-2 h-4 w-4" /> تعديل</Button>
                           <Button variant="destructive" onClick={handleLogout}><LogOut className="ml-2 h-4 w-4" /> خروج</Button>
                        </>
                    )}
                 </div>
            </CardHeader>
            <CardContent className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {/* Stats Card */}
                    <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>إحصائياتك</CardTitle>
                        <CardDescription>نظرة سريعة على نشاطك في الطهي.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                            <div className="p-3 bg-red-500/10 rounded-full">
                                <Heart className="h-8 w-8 text-red-500" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">الوصفات المفضلة</p>
                                <p className="text-2xl font-bold">{favorites.length}</p>
                            </div>
                        </div>
                    </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
