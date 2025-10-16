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
import { baseEventMenuConfig, BaseEventMenuData, baseEventMenuSchema } from "@/schemas/menuFormConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

type EventMenuFormProps = {
  initialValues?: Partial<BaseEventMenuData>;
  onSubmit: (values: BaseEventMenuData) => void;
  title: string;
  trigger: React.ReactElement;
  event?: Event;
};

export default function EventMenuForm({
  initialValues,
  onSubmit,
  title,
  trigger,
}: EventMenuFormProps) {
  const t = useTranslations("base.forms");
  const [isOpen, setOpen] = useState(false);

  const form = useForm<BaseEventMenuData>({
    resolver: zodResolver(baseEventMenuSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (data: BaseEventMenuData) => {
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
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {baseEventMenuConfig.map((fieldConfig) => (
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
