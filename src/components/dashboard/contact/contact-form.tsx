"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AutoFormField, Form } from "@/components/ui/form";
import {
  baseContactConfig,
  BaseContactData,
  baseContactSchema,
} from "@/schemas/contactFormConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ContactFormProps = {
  initialValues?: Partial<BaseContactData>;
  onSubmit: (values: BaseContactData) => void;
  title: string;
  trigger: React.ReactElement;
  event?: Event;
};

export default function ContactForm({
  initialValues,
  onSubmit,
  title,
  trigger,
}: ContactFormProps) {
  const t = useTranslations("base.forms");
  const [isOpen, setOpen] = useState(false);

  const form = useForm<BaseContactData>({
    resolver: zodResolver(baseContactSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (data: BaseContactData) => {
    onSubmit(data);
    setOpen(false);
  };

  const openChange = (open: boolean) => {
    setOpen(open);
    form.reset(initialValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
