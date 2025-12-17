"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  uploaderNameConfig,
  UploaderNameData,
  uploaderNameSchema,
} from "@/schemas/imageSchemaConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AutoFormField, Form } from "../ui/form";

interface NameInputStepProps {
  onNameSubmit: (name: string) => void;
}

export function NameInputStep({ onNameSubmit }: NameInputStepProps) {
  const t = useTranslations("imagesUpload");

  const form = useForm<UploaderNameData>({
    resolver: zodResolver(uploaderNameSchema),
    defaultValues: {
      uploaderName: "",
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardDescription className="text-lg">
          {t("enterNamePrompt")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onNameSubmit(data.uploaderName.trim())
            )}
            className="space-y-4"
          >
            {uploaderNameConfig.map((fieldConfig) => (
              <AutoFormField
                key={fieldConfig.name}
                control={form.control}
                fieldConfig={fieldConfig}
              />
            ))}
            <Button
              type="submit"
              className="w-full"
              disabled={!form.watch("uploaderName")?.trim()}
            >
              {t("continue")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
