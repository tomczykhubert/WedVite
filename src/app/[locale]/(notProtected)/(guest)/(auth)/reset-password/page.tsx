"use client";

import ActionButton from "@/components/base/button-link";
import FormErrorMessage from "@/components/base/form-error-messege";
import Loader from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoFormField, Form } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";
import { stc } from "@/i18n/utils";
import { resetPassword } from "@/lib/auth/authClient";
import {
  FormConfig,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { routes } from "@/lib/routes/routes";
import { zMinMaxString } from "@/lib/zod/extension";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formConfig: FormConfig = [
  {
    name: "newPassword",
    type: "password",
    required: true,
    label: stc("user.newPassword"),
    validation: zMinMaxString(6, 30).required(),
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    type: "password",
    required: true,
    label: stc("user.confirmNewPassword"),
    validation: zMinMaxString(6, 30).required(),
    autoComplete: "new-password",
  },
];

const formSchema = z
  .object(translateSchemaConfig(formConfig))
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: stc("passwordMismatch"),
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const [isPending, setPending] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const t = useTranslations("user");
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const setInvalidResetTokenMessage = () => {
    setFormErrorMessage("auth.invalidResetToken");
  };

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setInvalidResetTokenMessage();
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setInvalidResetTokenMessage();
      return;
    }

    setFormErrorMessage("");
    setPending(true);
    try {
      const { error } = await resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (error) {
        console.log(error);
        setInvalidResetTokenMessage();
        return;
      }

      toast.success(t("passwordResetSuccess"));
      form.reset();
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push(routes.auth.signIn);
      }, 2000);
    } catch {
      setFormErrorMessage("auth.default");
    } finally {
      setPending(false);
    }
  };

  if (!token && formErrorMessage === "invalidResetToken") {
    return (
      <div className="my-5 max-w-[600px] mx-auto">
        <Card className="mx-4">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center m-0">{t("resetPassword")}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormErrorMessage message={formErrorMessage} />
            <div className="mt-4">
              <ActionButton
                href={routes.auth.forgotPassword}
                className="w-full"
                variant={"default"}
              >
                <KeyRound className="mr-1" />
                {t("sendResetLink")}
              </ActionButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-5 max-w-[600px] mx-auto">
      <div className="relative">
        <Card className="mx-4">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center m-0">{t("resetPassword")}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("enterNewPassword")}
            </p>
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
                <Button type="submit" className="w-full" disabled={!token}>
                  <KeyRound className="mr-1" />
                  {t("resetPassword")}
                </Button>
              </form>
            </Form>
            <div className="mt-4">
              <ActionButton
                href={routes.auth.signIn}
                className="w-full"
                variant={"outline"}
              >
                <ArrowLeft className="mr-1" />
                {t("backToSignIn")}
              </ActionButton>
            </div>
          </CardContent>
        </Card>
        <Loader isLoading={isPending} />
      </div>
    </div>
  );
}
