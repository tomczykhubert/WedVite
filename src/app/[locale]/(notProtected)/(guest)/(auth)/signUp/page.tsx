"use client";
import GoogleLogin from "@/components/auth/google-login";
import ActionButton from "@/components/button-link";
import FormErrorMessage from "@/components/form-error-messege";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoFormField, Form } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";
import { stc } from "@/i18n/utils";
import { signUp } from "@/lib/auth/authClient";
import { getErrorTypeConfig } from "@/lib/auth/errors";
import {
  FormConfig,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { routes } from "@/lib/routes/routes";
import { zMaxString, zMinMaxString } from "@/lib/zod/extension";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import { z } from "zod";

const formConfig: FormConfig = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("user.name"),
    validation: zMinMaxString(6, 30).required(),
  },
  {
    name: "email",
    type: "email",
    required: true,
    label: stc("user.email"),
    validation: zMaxString()
      .email({ message: stc("email") })
      .required(),
  },
  {
    name: "password",
    type: "password",
    label: stc("user.password"),
    required: true,
    validation: zMinMaxString(6, 30).required(),
  },
  {
    name: "confirmPassword",
    type: "password",
    label: stc("user.confirmPassword"),
    required: true,
    validation: z.string().required(),
  },
];

const formSchema = z
  .object(translateSchemaConfig(formConfig))
  .refine((data) => data.password === data.confirmPassword, {
    message: stc("passwordMismatch"),
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("user");
  const [isPending, setPending] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const locale = useLocale();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setFormErrorMessage("");
    await signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        preferredLocale: locale,
      },
      {
        onResponse: () => {
          setPending(false);
        },
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          router.replace(routes.auth.signIn);
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
              <h1 className="text-center m-0">{t("signUp")}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormErrorMessage message={formErrorMessage} />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {formConfig.map((fieldConfig) => (
                  <AutoFormField
                    key={fieldConfig.name}
                    control={form.control}
                    fieldConfig={fieldConfig}
                  />
                ))}
                <Button disabled={isPending} type="submit" className="w-full">
                  <LuUserPlus className="mr-1" /> {t("signUp")}
                </Button>
              </form>
            </Form>
            <GoogleLogin setPending={setPending} />
            <p className="text-sm text-muted-foreground mb-2">
              {t("alreadySignedUp")}
            </p>
            <ActionButton
              href={routes.auth.signIn}
              className="w-full"
              variant={"outline"}
            >
              <LuLogIn className="mr-1" />
              {t("signIn")}
            </ActionButton>
          </CardContent>
        </Card>
        <Loader isLoading={isPending} />
      </div>
    </div>
  );
}
