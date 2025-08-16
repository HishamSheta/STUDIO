"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, Heart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { UserPlus, LogIn } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, avatar: string} | null>(null);

  useEffect(() => {
    // This effect runs on the client and avoids hydration mismatches
    const checkLoginStatus = () => {
        const loggedInStatus = localStorage.getItem('cookai_loggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
        if (loggedInStatus) {
            const storedUser = localStorage.getItem('cookai_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } else {
            setUser(null);
        }
    };
    checkLoginStatus();

    // Listen for storage changes to update UI across tabs
    window.addEventListener('storage', checkLoginStatus);
    
    // Also re-check on navigation
    // The dependency array with `pathname` already handles this.

    return () => {
        window.removeEventListener('storage', checkLoginStatus);
    }
  }, [pathname]);


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
                <span className="text-xl font-bold font-headline text-primary leading-none">
                  طباخ AI
                </span>
                <span className="hidden md:inline text-xs text-muted-foreground whitespace-nowrap">
                    من الموجود، نعمل الموعود
                </span>
            </div>
          </Link>
        </div>
        
        <div className="flex-grow" />

        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
           <nav className="flex items-center gap-2">
                {isLoggedIn && user ? (
                   <>
                    <Link
                      href="/favorites"
                      className={cn(
                        "flex items-center gap-2 transition-colors hover:text-primary px-2",
                        pathname === "/favorites" ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <Heart className="h-5 w-5" />
                      <span className="hidden sm:inline">المفضلة</span>
                    </Link>
                    <Link href="/profile">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                        </Avatar>
                    </Link>
                   </>
                ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" asChild size="sm">
                        <Link href="/login">
                            <LogIn className="ml-1 sm:ml-2 h-4 w-4" />
                             <span className="hidden sm:inline">تسجيل الدخول</span>
                        </Link>
                    </Button>
                     <Button asChild size="sm">
                        <Link href="/signup">
                            <UserPlus className="ml-1 sm:ml-2 h-4 w-4" />
                            <span className="hidden sm:inline">إنشاء حساب</span>
                        </Link>
                    </Button>
                </div>
            )}
           </nav>
           
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                فاتح
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                داكن
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                النظام
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
