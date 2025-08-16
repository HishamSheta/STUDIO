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
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل." }),
    email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح." }),
    password: z.string().min(8, { message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين.",
    path: ["confirmPassword"],
  });

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would create a user in the backend.
    // Here we'll just save it to localStorage for simulation.
    const user = {
        name: values.name,
        email: values.email,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${values.name}`
    };
    localStorage.setItem('cookai_user', JSON.stringify(user));
    localStorage.setItem('cookai_loggedIn', 'true');

    toast({
      title: "تم إنشاء الحساب بنجاح!",
      description: "تم تسجيل دخولك تلقائياً.",
    });
    router.push('/profile');
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>إنشاء حساب جديد</CardTitle>
          <CardDescription>
            أدخل بياناتك للانضمام إلى مجتمع طباخ AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="اسمك الكامل"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأكيد كلمة المرور</FormLabel>
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
                إنشاء حساب
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="underline text-primary">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
