"use client";
import ActionButton from "@/components/base/button-link";
import Loader from "@/components/base/loader";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { basePlanItemConfig } from "@/schemas/planItemFormConfig";
import { useTRPC } from "@/trpc/client";
import { EventPlanItem } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import z from "zod";
import PlanItemForm from "./plan-item-form";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object(translateSchemaConfig(basePlanItemConfig));

type FormData = z.infer<typeof formSchema>;

type UpdatePlanItemFormProps = {
  planItem: EventPlanItem;
};

export default function UpdatePlanItemForm({
  planItem,
}: UpdatePlanItemFormProps) {
  const validationT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.planItem");
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const updatePlanItem = useMutation(
    trpc.planItem.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.planItem.pathFilter());
      },
      onError: () => {
        toast.error(validationT("error"));
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
    updatePlanItem.mutate({
      ...data,
      id: planItem.id,
    });
  };

  const initialValues = {
    name: planItem.name,
    description: planItem.description,
    details: planItem.details,
    startAt: planItem.startAt,
    endAt: planItem.endAt,
    addressLine1: planItem.addressLine1,
    addressLine2: planItem.addressLine2,
    city: planItem.city,
    postalCode: planItem.postalCode,
    region: planItem.region,
    country: planItem.country,
  };

  const trigger = (
    <ActionButton variant="default" size="icon" tooltip={t("update")}>
      <FaEdit />
    </ActionButton>
  );
  return (
    <>
      <Loader isLoading={loading} />
      <PlanItemForm
        title={t("update")}
        initialValues={initialValues}
        trigger={trigger}
        onSubmit={onSubmit}
      ></PlanItemForm>
    </>
  );
}
