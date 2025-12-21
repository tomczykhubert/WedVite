"use client";

import ActionButton from "@/components/base/button-link";
import FormErrorMessage from "@/components/base/form-error-messege";
import Loader from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoFormField, Form } from "@/components/ui/form";
import { stc } from "@/i18n/utils";
import { requestPasswordReset } from "@/lib/auth/authClient";
import {
  FormConfig,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { routes } from "@/lib/routes/routes";
import { zMaxString } from "@/lib/zod/extension";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send } from "lucide-react";
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
];

const formSchema = z.object(translateSchemaConfig(formConfig));

type ForgotPasswordFormData = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [isPending, setPending] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const t = useTranslations("user");
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setFormErrorMessage("");
    setPending(true);
    try {
      await requestPasswordReset({
        email: data.email,
      });

      toast.success(t("resetLinkSent"));
      form.reset();
    } catch {
      setFormErrorMessage("auth.default");
    } finally {
      setPending(false);
    }
  };

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
              {t("resetPasswordInstructions")}
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
                <Button type="submit" className="w-full">
                  <Send className="mr-1" />
                  {t("sendResetLink")}
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
