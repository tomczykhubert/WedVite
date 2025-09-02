"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { baseContactConfig } from "@/schemas/contactFormConfig";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FaAddressBook } from "react-icons/fa";
import z from "zod";
import ContactForm from "./contact-form";
import { TRPCResponse } from "@/trpc/routers/_app";
import { EventContact } from "@prisma/client";
import { showError } from "@/lib/utils";
import { useState } from "react";
import Loader from "@/components/loader";

const formSchema = z.object(translateSchemaConfig(baseContactConfig));

type FormData = z.infer<typeof formSchema>;

type AddContactFormProps = {
  eventId: string
}

export default function AddContactForm({ eventId }: AddContactFormProps) {
  const validationT = useTranslations("formValidation");
  const t = useTranslations("dashboard.forms.contact");
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createContact = useMutation(
    trpc.contact.add.mutationOptions({
      onSuccess: async (res: TRPCResponse<EventContact>) => {
        if(res.success) {
          await queryClient.invalidateQueries(trpc.contact.pathFilter());
          return
        }
        showError(validationT, res.error);
      },
      onError: (err) => {
        showError(validationT, {key: "forms.error"});
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      }
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
  const trigger = (<Card className="h-full min-h-[300px] text-accent bg-accent/20 hover:bg-muted hover:text-current transition-all duration-200 cursor-pointer border-dashed border-2">
    <CardContent className="flex flex-col h-full justify-center items-center gap-4 font-bold">
      <FaAddressBook className="h-20 w-20" />
      <span>
        {t("add")}
      </span>
    </CardContent>
  </Card>)

  return (
    <>
    <Loader isLoading={loading}/>
    <ContactForm title={t("add")} initialValues={initialValues} trigger={trigger} onSubmit={onSubmit}></ContactForm>
    </>
  );
}
