"use client";
import {
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";
import { EventPlanItem } from "@prisma/client";
import ActionButton from "@/components/button-link";
import { FaEdit } from "react-icons/fa";
import PlanItemForm from "./plan-item-form";
import { basePlanItemConfig } from "@/schemas/planItemFormConfig";

const formSchema = z.object(translateSchemaConfig(basePlanItemConfig));

type FormData = z.infer<typeof formSchema>;

type UpdatePlanItemFormProps = {
  planItem: EventPlanItem
}

export default function UpdatePlanItemForm({ planItem }: UpdatePlanItemFormProps) {
  const baseT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.planItem");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const updatePlanItem = useMutation(
    trpc.planItem.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.planItem.pathFilter());
      },
      onError: (err) => {
        toast.error(baseT("error"));
      },
    }),
  );

  const onSubmit = (data: FormData) => {
    updatePlanItem.mutate({
      ...data,
      id: planItem.id,
    });
  };

    const initialValues = {
    name: planItem.name,
    description: planItem.description,
    details: planItem.details,
    startAt: planItem.startAt ?? new Date(),
    endAt: planItem.endAt ?? new Date(),
    addressLine1:  planItem.addressLine1,
    addressLine2: planItem.addressLine2,
    city: planItem.city,
    postalCode: planItem.postalCode,
    region: planItem.region,
    country: planItem.country,  
  }
  
  const trigger = (<ActionButton variant="default" size="icon" tooltip={t("update")} ><FaEdit /></ActionButton>);
  return (
    <PlanItemForm title={t("update")} initialValues={initialValues} trigger={trigger} onSubmit={onSubmit}></PlanItemForm>
  );
}
