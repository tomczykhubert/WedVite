"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { basePlanItemConfig } from "@/schemas/planItemFormConfig";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FaCalendarPlus } from "react-icons/fa";
import { toast } from "sonner";
import z from "zod";
import PlanItemForm from "./plan-item-form";
import { useState } from "react";
import Loader from "@/components/loader";

const formSchema = z.object(translateSchemaConfig(basePlanItemConfig));

type FormData = z.infer<typeof formSchema>;

type AddPlanItemFormProps = {
  eventId: string
}

export default function AddPlanItemForm({ eventId }: AddPlanItemFormProps) {
  const validationT = useTranslations("formValidation");
  const t = useTranslations("dashboard.forms.planItem");
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createPlanItem = useMutation(
    trpc.planItem.add.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.planItem.pathFilter());
      },
      onError: (err) => {
        toast.error(validationT("forms.error"));
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
    createPlanItem.mutate({
      ...data,
      eventId: eventId
    });
  };

  const initialValues = {
    name: "",
    description: "",
    details: "",
    startAt: new Date(),
    endAt: null,
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    region: "",
    country: null,  
  }

  const trigger = (<Card className="h-full min-h-[300px] text-accent bg-accent/20 hover:bg-muted hover:text-current transition-all duration-200 cursor-pointer border-dashed border-2">
    <CardContent className="flex flex-col h-full justify-center items-center gap-4 font-bold">
      <FaCalendarPlus className="h-20 w-20" />
      <span>
        {t("add")}
      </span>
    </CardContent>
  </Card>)
  return (
    <>
    <Loader isLoading={loading}/>
    <PlanItemForm title={t("add")} initialValues={initialValues} trigger={trigger} onSubmit={onSubmit}></PlanItemForm>
    </>
  );
}
