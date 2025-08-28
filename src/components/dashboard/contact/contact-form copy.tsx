"use client";
import FormErrorMessage from "@/components/form-error-messege";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaAddressBook } from "react-icons/fa";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object(translateSchemaConfig(baseContactConfig));

type FormData = z.infer<typeof formSchema>;

type AddContactFormProps = {
  eventId: string
}

export default function ContactFormCopy({ eventId }: AddContactFormProps) {
  const baseT = useTranslations("base.forms");
  const t = useTranslations("dashboard.forms.contact");
  const [isOpen, setOpen] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createContact = useMutation(
    trpc.contact.add.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
      },
      onError: (err) => {
        toast.error(baseT("error"));
      },
    }),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      contactType: undefined
    },
  });

  const onSubmit = (data: FormData) => {
    setFormErrorMessage("");
    createContact.mutate({
      ...data,
      eventId: eventId
    });
    setOpen(false);
  };

  const openChange = (open: boolean) => {
    setOpen(open)

    if(open)
      form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Card className="h-full min-h-[300px] text-gray-400 hover:bg-muted hover:text-current transition-all duration-200 cursor-pointer">
          <CardContent className="flex flex-col h-full justify-center items-center gap-4 font-bold">
            <FaAddressBook className="h-20 w-20" />
            <span>
              {t("addContact")}
            </span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AlertDialogHeader>
              <DialogTitle>{t("addContact")}</DialogTitle>
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
