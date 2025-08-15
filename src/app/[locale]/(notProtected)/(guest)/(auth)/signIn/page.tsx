"use client";

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
import { signIn } from "@/lib/auth/authClient";
import { routes } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import ActionButton from "@/components/button-link";
import GoogleLogin from "@/components/auth/google-login";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormConfig, translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { stc } from "@/i18n/utils";

const formConfig: FormConfig = [
  {
    name: "email",
    type: "email",
    required: true,
    label: stc("user.email"),
    validation: z
      .string()
      .nonempty(stc("required"))
      .email({
        message: stc("email"),
      }),
  },
  {
    name: "password",
    type: "password",
    label: stc("user.password"),
    required: true,
    validation: z
      .string()
      .nonempty(stc("required"))
  }
];

const formSchema = z.object(translateSchemaConfig(formConfig))

type SignInFormData = z.infer<typeof formSchema>;

export default function SignInForm() {
  const t = useTranslations("user");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  //TODO: handle errors(email not verified)
  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            router.replace(routes.dashboard.index);
          },

          onError: (error) => {
            form.setError("email", {
              type: "manual",
              message: t("signInError"),
            });
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="my-5 max-w-[600px] mx-auto">
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>
            <h1 className="text-center m-0">{t("signIn")}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t("email")} {...field} />
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
              <Button type="submit" className="w-full">
                <LuLogIn className="mr-1" />
                {t("signIn")}
              </Button>
            </form>
          </Form>
          <GoogleLogin />
          <p className="text-sm text-muted-foreground mb-2">{t("notYetSignedUp")}</p>
          <ActionButton
            href={routes.auth.signUp}
            className="w-full"
            variant={"outline"}
          >
            <LuUserPlus className="mr-1" />
            {t("signUp")}
          </ActionButton>
        </CardContent>
      </Card>
    </div>
  );
}
