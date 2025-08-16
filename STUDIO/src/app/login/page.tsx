"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح." }),
    password: z.string().min(1, { message: "الرجاء إدخال كلمة المرور." }),
  });

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would authenticate with a backend.
    // Here we'll simulate it by setting a flag in localStorage.
    // We'll also check if there's user data and create a placeholder if not.
    let user = localStorage.getItem('cookai_user');
    if (!user) {
        // If user logs in without signing up (for demo purposes)
        localStorage.setItem('cookai_user', JSON.stringify({ name: 'مستخدم جديد', email: values.email }));
    }
    
    localStorage.setItem('cookai_loggedIn', 'true');

    toast({
      title: "تم تسجيل الدخول بنجاح!",
      description: "مرحباً بعودتك.",
    });
    router.push('/profile');
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>تسجيل الدخول</CardTitle>
          <CardDescription>
            مرحباً بعودتك! أدخل بياناتك للوصول إلى حسابك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="yourname@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                تسجيل الدخول
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            ليس لديك حساب؟{" "}
            <Link href="/signup" className="underline text-primary">
              إنشاء حساب
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
