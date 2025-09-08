"use client";
import ActionButton from "@/components/base/button-link";
import Loader from "@/components/base/loader";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { baseContactConfig } from "@/schemas/contactFormConfig";
import { useTRPC } from "@/trpc/client";
import { EventContact } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import z from "zod";
import ContactForm from "./contact-form";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object(translateSchemaConfig(baseContactConfig));

type FormData = z.infer<typeof formSchema>;

type UpdateContactFormProps = {
  contact: EventContact;
};

export default function UpdateContactForm({ contact }: UpdateContactFormProps) {
  const baseT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.contact");
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const updateContact = useMutation(
    trpc.contact.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
      },
      onError: () => {
        toast.error(baseT("error"));
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      },
    })
  );

  const onSubmit = (data: FormData) => {
    updateContact.mutate({
      ...data,
      id: contact.id,
    });
  };

  const initialValues = {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    contactType: contact.type,
  };

  const trigger = (
    <ActionButton variant="default" size="icon" tooltip={t("update")}>
      <FaEdit />
    </ActionButton>
  );
  return (
    <>
      <Loader isLoading={loading} />
      <ContactForm
        title={t("update")}
        initialValues={initialValues}
        trigger={trigger}
        onSubmit={onSubmit}
      ></ContactForm>
    </>
  );
}
