"use client";
import FormErrorMessage from "@/components/form-error-messege";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AutoFormField, Form } from "@/components/ui/form";
import {
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { baseContactConfig } from "@/schemas/contact/contactFormConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object(translateSchemaConfig(baseContactConfig));

type FormData = z.infer<typeof formSchema>;

type ContactFormProps = {
  initialValues?: Partial<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  title: string;
  trigger: React.ReactElement;
  event?: Event;
}

export default function ContactForm({
  initialValues,
  onSubmit,
  title,
  trigger,
}: ContactFormProps) {
  const t = useTranslations("base.forms");
  const [isOpen, setOpen] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  });

  const handleSubmit = (data: FormData) => {
    setFormErrorMessage("");
    onSubmit(data);
    setOpen(false);
  };

  const openChange = (open: boolean) => {
    setOpen(open)

    if (!open)
      form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <AlertDialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                <FormErrorMessage message={formErrorMessage} />
              </DialogDescription>
            </AlertDialogHeader>
            {baseContactConfig.map((fieldConfig) => (
              <AutoFormField
                key={fieldConfig.name}
                control={form.control}
                fieldConfig={fieldConfig}
              />
            ))}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
              <Button type="submit">{t("submit")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
