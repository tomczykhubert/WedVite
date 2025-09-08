import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { EventPlanItem } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { FaTrash } from "react-icons/fa";
import { IoLocation, IoTime } from "react-icons/io5";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { toast } from "sonner";
import UpdatePlanItemForm from "./update-plan-item-form";

export default function PlanItemCard({
  planItem,
}: {
  planItem: EventPlanItem;
}) {
  const format = useFormatter();

  const FormatDate = (date: Date) => {
    return format.dateTime(date, {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <Card
      key={planItem.id}
      className="h-full min-h-[300px] overflow-hidden bg-accent/20 pt-0 border-dashed border-2"
    >
      <CardHeader className="flex justify-between bg-muted py-4 px-8 border-dashed border-b-2 border-b-accent">
        <CardTitle>
          <h3 className="whitespace-normal [overflow-wrap:anywhere] mb-0">
            {planItem.name}
          </h3>
        </CardTitle>
        <div className="flex gap-2">
          <UpdatePlanItemForm planItem={planItem} />
          <DeletePlanItem planItem={planItem} />
        </div>
      </CardHeader>
      <CardContent>
        {planItem.description && (
          <div className="gap-2 mb-2 bg-muted rounded-xl border-dashed border-2 border-accent p-2">
            {planItem.description}
          </div>
        )}
        <div className="flex items-center text-lg gap-2 mb-2 bg-muted rounded-xl border-dashed border-2 border-accent p-2">
          <div className="text-primary">
            <IoTime />
          </div>
          <div>
            <span>{FormatDate(planItem.startAt)}</span>
            {planItem.endAt && (
              <>
                <span className="ml-3 mr-3">—</span>
                <span className="text-nowrap">
                  {FormatDate(planItem.endAt)}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center text-lg gap-2 mb-2 bg-muted rounded-xl border-dashed border-2 border-accent p-2">
          <div className="text-primary">
            <IoLocation />
          </div>
          <div>
            <div>{planItem.addressLine1}</div>
            <div>{planItem.addressLine2}</div>
            <div>
              {planItem.postalCode}, {planItem.city}
            </div>
            <div className="flex items-center">
              {planItem.country && (
                <Flag
                  country={planItem.country as unknown as RPNInput.Country}
                />
              )}
              {planItem.region && (
                <span className="ml-2">{planItem.region}</span>
              )}
            </div>
          </div>
        </div>
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
      onError: () => {
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

const Flag = ({ country }: { country: RPNInput.Country }) => {
  const FlagIcon = flags[country];
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {FlagIcon && <FlagIcon title={country} />}
    </span>
  );
};
