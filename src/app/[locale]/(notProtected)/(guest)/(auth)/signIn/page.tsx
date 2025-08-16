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
import {
  FormConfig,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { stc } from "@/i18n/utils";
import { getErrorTypeConfig } from "@/lib/auth/errors";
import { useState } from "react";
import Loader from "@/components/loader";
import FormErrorMessage from "@/components/form-error-messege";

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
    validation: z.string().nonempty(stc("required")),
  },
];

const formSchema = z.object(translateSchemaConfig(formConfig));

type SignInFormData = z.infer<typeof formSchema>;

export default function SignInForm() {
  const [isPending, setPending] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const t = useTranslations("user");
  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: SignInFormData) => {
    setFormErrorMessage("");
    await signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onResponse: () => {
          setPending(false);
        },
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          router.replace(routes.dashboard.index);
        },
        onError: (error) => {
          const errorType = getErrorTypeConfig(error.error.code);
          if (errorType.fieldName) {
            form.setError(errorType.fieldName, {
              type: "manual",
              message: stc(errorType.message),
            });
          } else {
            setFormErrorMessage(errorType.message);
          }
        },
      }
    );
  };

  return (
    <div className="my-5 max-w-[600px] mx-auto">
      <div className="relative">
        <Card className="mx-4">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center m-0">{t("signIn")}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormErrorMessage message={formErrorMessage} />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
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
                <Button type="submit" className="w-full">
                  <LuLogIn className="mr-1" />
                  {t("signIn")}
                </Button>
              </form>
            </Form>
            <GoogleLogin setPending={setPending}/>
            <p className="text-sm text-muted-foreground mb-2">
              {t("notYetSignedUp")}
            </p>
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
        <Loader isLoading={isPending} />
      </div>
    </div>
  );
}
