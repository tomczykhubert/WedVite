"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth/authClient";

const formSchema = z
  .object({
    email: z.string().email({
      message: "user.validations.email.invalid",
    }),
    password: z.string().min(6, {
      message: "user.validations.password.tooShort",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "user.validations.password.mismatch",
    path: ["confirmPassword"],
  });
//TODO: Tlumaczenia i przetestowac rejestracje
type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signUp.email({
        name: "",
        email: data.email,
        password: data.password,
      });
      router.push("/");
    } catch {}
  };

  return (
    <div className="mt-5 max-w-[525px] mx-auto">
      <h1 className="text-3xl mb-5">user.createAccount"</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>"user.email"</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user.emailPlaceholder"
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
                <FormLabel>"user.password"</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="user.passwordPlaceholder"
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
                <FormLabel>"user.confirmPassword"</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="user.confirmPasswordPlaceholder"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            "user.signUp"
          </Button>
        </form>
      </Form>
    </div>
  );
}
