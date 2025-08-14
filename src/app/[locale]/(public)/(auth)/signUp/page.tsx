"use client";
import React from "react";
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
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LuUserPlus } from "react-icons/lu";
import { stc } from "@/i18n/utils";

const a = {
  email: {
    required: true,
    type: "email",
      validation: z.string().nonempty(stc("required")).email({
      message: stc("email"),
    })
  },
  password: {
    required: true,
    type: "password",
      validation: z.string().nonempty(stc("required")).email({
      message: stc("email"),
    })
  }
}
const translateSchemaConfig = (config: Record<string, any>) => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(config)) {
    if(value.required) {
      result[key] = value.validation.nonempty(stc("required"))
    } else {
      result[key] = value.validation;
    }
  }
  return result;
}

const schema = z.object(translateSchemaConfig(a))

const formSchema = z
  .object({
    email: z.string().nonempty(stc("required")).email({
      message: stc("email"),
    }),
    password: z.string().nonempty(stc("required"))
    .min(6, stc("minLength", { min: 6 }))
    .max(12, stc("maxLength", { max: 12 })),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: stc("passwordMismatch"),
    path: ["confirmPassword"],
  });
//TODO: Tlumaczenia i przetestowac rejestracje
type FormData = z.infer<typeof formSchema>;
console.log(FormData);

export default function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("user");
  
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
      <h1 className="text-3xl mb-5">{t("signUp")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("email")}
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
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("password")}
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
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("confirmPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            <LuUserPlus className="mr-1" /> {t("signUp")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
