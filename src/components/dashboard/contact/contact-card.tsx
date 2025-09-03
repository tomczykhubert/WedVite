import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { EventContact } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { MdDragIndicator, MdEmail, MdPerson, MdPhone } from "react-icons/md";
import { toast } from "sonner";
import UpdateContactForm from "./update-contact-form";

export default function ContactCard({
  contact,
  dragListeners,
  dragAttributes,
}: {
  contact: EventContact;
  dragListeners?: React.HTMLAttributes<HTMLButtonElement>;
  dragAttributes?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  const eventT = useTranslations("dashboard.event");
  const t = useTranslations("base");
  const details = [
    {
      id: "name",
      icon: MdPerson,
      text: `${contact.firstName} ${contact.lastName}`,
    },
    {
      id: "email",
      icon: MdEmail,
      text: contact.email,
    },
    {
      id: "phone",
      icon: MdPhone,
      text: contact.phoneNumber,
    },
  ] as const;

  return (
    <Card
      key={contact.id}
      className="h-full min-h-[250px] overflow-hidden bg-accent/20 pt-0 border-dashed border-2"
    >
      <CardHeader className="flex items-center justify-between bg-muted py-4 px-8 border-dashed border-b-2 border-b-accent">
        <CardTitle>
          <Image
            src={`/images/contact_types/${contact.type ? contact.type.toLowerCase() : "other"}.png`}
            alt={contact.type ? eventT(contact.type) : t("other")}
            width={64}
            height={64}
          />
        </CardTitle>
        <div className="flex gap-2">
          <UpdateContactForm contact={contact} />
          <ActionButton
            variant="outline"
            size="icon"
            tooltip={t("reorder")}
            {...dragListeners}
            {...dragAttributes}
          >
            <MdDragIndicator />
          </ActionButton>
          <DeleteContact contact={contact} />
        </div>
      </CardHeader>
      <CardContent>
        {details.map((detail) => {
          return (
            <div
              key={`detail-${detail.id}`}
              className="flex items-center gap-2 mb-2 bg-muted rounded-xl border-dashed border-2 border-accent p-2"
            >
              <div className="text-primary">
                <detail.icon />
              </div>
              <div className="whitespace-normal [overflow-wrap:anywhere]">
                {detail.text}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function DeleteContact({ contact }: { contact: EventContact }) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.contact.delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteContact = useMutation(
    trpc.contact.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
        toast.success(formsT("success"));
      },
      onError: (err) => {
        toast.error(formsT("error"));
      },
    })
  );
  const onConfirm = () => {
    deleteContact.mutate({ id: contact.id });
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

export function ContactCardSkeleton(props: { pulse?: boolean }) {
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
