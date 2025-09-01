import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EventPlanItem } from "@prisma/client";
import ActionButton from "@/components/button-link";
import { MdDragIndicator, MdEmail, MdPerson, MdPhone } from "react-icons/md";
import { useTranslations, useFormatter } from "next-intl";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfirmModal from "@/components/confirmModal";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import UpdatePlanItemForm from "./update-plan-item-form";

export default function PlanItemCard({
  planItem,
}: {
  planItem: EventPlanItem;
}) {
  const format = useFormatter();
  const t = useTranslations("base");
  const details = [
    {
      id: "description",
      icon: MdPerson,
      text: planItem.description
    },
    {
      id: "startAt",
      icon: MdPerson,
      text: planItem.startAt
    },
        {
      id: "endAt",
      icon: MdPerson,
      text: planItem.endAt
    },
    {
      id: "details",
      icon: MdPerson,
      text: planItem.details
    },
    {
      id: "adressLine1",
      icon: MdPerson,
      text: planItem.addressLine1
    },
    {
      id: "adressLine2",
      icon: MdPerson,
      text: planItem.addressLine2
    },
    {
      id: "city",
      icon: MdPerson,
      text: planItem.city
    },
    {
      id: "postalCode",
      icon: MdPerson,
      text: planItem.postalCode
    },
    {
      id: "region",
      icon: MdPerson,
      text: planItem.region
    },
    {
      id: "country",
      icon: MdPerson,
      text: planItem.country
    },
  ] as const;

  return (
    <Card
      key={planItem.id}
      className="h-full min-h-[300px] relative overflow-hidden"
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          <h2>{planItem.name}</h2>
        </CardTitle>
        <div className="flex gap-2">
          <UpdatePlanItemForm planItem={planItem} />
          <DeletePlanItem planItem={planItem} />
        </div>
      </CardHeader>
      <CardContent>
        {details.map((detail) => {
          return (
            <div
              key={`detail-${detail.id}`}
              className="flex items-center text-xl gap-2 mb-2"
            >
              <div>
                <detail.icon />
              </div>
              {detail.text instanceof Date ? format.dateTime(detail.text, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              }) :<div>{detail.text}</div> }

            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function DeletePlanItem({ planItem }: { planItem: EventPlanItem }) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.planItem.delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletePlanItem = useMutation(
    trpc.planItem.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.planItem.pathFilter());
        toast.success(formsT("success"));
      },
      onError: (err) => {
        toast.error(formsT("error"));
      },
    })
  );
  const onConfirm = () => {
    deletePlanItem.mutate({ id: planItem.id });
  };

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message")}
      onConfirm={onConfirm}
      trigger={
        <ActionButton variant="destructive" size="icon" tooltip={t("header")}>
          <FaTrash />
        </ActionButton>
      }
    />
  );
}

export function PlanItemCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;

  const lines = ["w-1/3", "w-4/5", "w-2/3", "w-1/4", "w-3/5"];
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4 h-full min-h-[300px]">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-3/4 rounded bg-accent text-2xl font-bold",
            pulse && "animate-pulse"
          )}
        >
          &nbsp;
        </h2>

        {lines.map((width, i) => (
          <p
            key={i}
            className={cn(
              `mt-2 w-${width} rounded bg-accent`,
              pulse && "animate-pulse",
              width
            )}
          >
            &nbsp;
          </p>
        ))}
      </div>
    </div>
  );
}
