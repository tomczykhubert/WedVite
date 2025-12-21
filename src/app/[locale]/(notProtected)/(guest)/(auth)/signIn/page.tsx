"use client";

import GoogleLogin from "@/components/auth/google-login";
import ActionButton from "@/components/base/button-link";
import FormErrorMessage from "@/components/base/form-error-messege";
import Loader from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoFormField, Form } from "@/components/ui/form";
import { Link, useRouter } from "@/i18n/navigation";
import { stc } from "@/i18n/utils";
import { authClient, signIn } from "@/lib/auth/authClient";
import { getErrorTypeConfig } from "@/lib/auth/errors";
import {
  FormConfig,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { routes } from "@/lib/routes/routes";
import { zMaxString } from "@/lib/zod/extension";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Mail, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formConfig: FormConfig = [
  {
    name: "email",
    type: "email",
    required: true,
    label: stc("user.email"),
    validation: zMaxString()
      .email({ message: stc("email") })
      .required(),
    autoComplete: "email",
  },
  {
    name: "password",
    type: "password",
    label: stc("user.password"),
    required: true,
    autoComplete: "current-password",
    validation: z.string().required(),
  },
];

const formSchema = z.object(translateSchemaConfig(formConfig));

type SignInFormData = z.infer<typeof formSchema>;

export default function SignInForm() {
  const [isPending, setPending] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const tEmails = useTranslations("emails.verification");
  const tValidation = useTranslations("formValidation");
  const t = useTranslations("user");
  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      await authClient.sendVerificationEmail({
        email: userEmail,
        callbackURL: "/dashboard",
      });
      toast.success(tEmails("resendSuccess"));
    } catch {
      toast.error(tValidation("auth.default"));
    } finally {
      setResendingVerification(false);
    }
  };

  const onSubmit = async (data: SignInFormData) => {
    setFormErrorMessage("");
    setShowResendVerification(false);
    setUserEmail(data.email);
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
            if (error.error.code === "EMAIL_NOT_VERIFIED") {
              setShowResendVerification(true);
            }
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
            {showResendVerification && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <Button
                  onClick={handleResendVerification}
                  disabled={resendingVerification}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="mr-1" />
                  {tEmails("resendButton")}
                </Button>
              </div>
            )}
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
                <div className="flex justify-end">
                  <Link
                    href={routes.auth.forgotPassword}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Button type="submit" className="w-full">
                  <LogIn className="mr-1" />
                  {t("signIn")}
                </Button>
              </form>
            </Form>
            <GoogleLogin setPending={setPending} />
            <p className="text-sm text-muted-foreground mb-2">
              {t("notYetSignedUp")}
            </p>
            <ActionButton
              href={routes.auth.signUp}
              className="w-full"
              variant={"outline"}
            >
              <UserPlus className="mr-1" />
              {t("signUp")}
            </ActionButton>
          </CardContent>
        </Card>
        <Loader isLoading={isPending} />
      </div>
    </div>
  );
}
