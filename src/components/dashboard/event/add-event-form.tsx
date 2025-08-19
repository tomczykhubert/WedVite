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
import { useRouter } from "@/i18n/navigation";
import { stc } from "@/i18n/utils";
import {
  FormConfig,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { addEventSchema } from "@/schemas/event/addEventSchema";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object(translateSchemaConfig(addEventSchema));

type FormData = z.infer<typeof formSchema>;

export default function AddEventForm() {
  const baseT = useTranslations("base.forms");
  const t = useTranslations("dashboard.forms.addEventForm");
  const [isPending, setPending] = useState(false);
  const [isOpen, setOpen] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const addEvent = trpc.event.add.useMutation();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setFormErrorMessage("");
    const response = addEvent.mutate({ name: data.name });
    console.log(response);
    router.refresh();
		setOpen(false);
		form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("addEvent")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AlertDialogHeader>
              <DialogTitle>{t("addEvent")}</DialogTitle>
              <DialogDescription>
                <FormErrorMessage message={formErrorMessage} />
              </DialogDescription>
            </AlertDialogHeader>
            {addEventSchema.map((fieldConfig) => (
              <AutoFormField
                key={fieldConfig.name}
                control={form.control}
                fieldConfig={fieldConfig}
              />
            ))}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{baseT("cancel")}</Button>
              </DialogClose>
              <Button type="submit">{baseT("submit")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
