"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { baseContactConfig } from "@/schemas/contact/contactFormConfig";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FaAddressBook } from "react-icons/fa";
import { toast } from "sonner";
import z from "zod";
import ContactForm from "./contact-form";

const formSchema = z.object(translateSchemaConfig(baseContactConfig));

type FormData = z.infer<typeof formSchema>;

type AddContactFormProps = {
  eventId: string
}

export default function AddContactForm({ eventId }: AddContactFormProps) {
  const baseT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.contact");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createContact = useMutation(
    trpc.contact.add.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
      },
      onError: (err) => {
        toast.error(baseT("error"));
      },
    }),
  );

  const onSubmit = (data: FormData) => {
    createContact.mutate({
      ...data,
      eventId: eventId
    });
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    contactType: null,
  }
  const trigger = (<Card className="h-full min-h-[300px] text-gray-400 hover:bg-muted hover:text-current transition-all duration-200 cursor-pointer">
    <CardContent className="flex flex-col h-full justify-center items-center gap-4 font-bold">
      <FaAddressBook className="h-20 w-20" />
      <span>
        {t("addContact")}
      </span>
    </CardContent>
  </Card>)
  return (
    <ContactForm title={t("addContact")} initialValues={initialValues} trigger={trigger} onSubmit={onSubmit}></ContactForm>
  );
}
