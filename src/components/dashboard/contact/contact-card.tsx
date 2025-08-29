import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EventContact } from "@prisma/client";
import UpdateContactForm from "./update-contact-form";
import ActionButton from "@/components/button-link";
import { MdDragIndicator, MdEmail, MdPerson, MdPhone } from "react-icons/md";
import { useTranslations } from "next-intl";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfirmModal from "@/components/confirmModal";
import { FaTrash } from "react-icons/fa";

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
      className="h-full min-h-[300px] relative overflow-hidden"
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          <h2 className="m-0 whitespace-normal [overflow-wrap:anywhere]">
            {contact.type ? eventT(contact.type) : t("other")}
          </h2>
        </CardTitle>
        <div className="flex gap-2">
          <UpdateContactForm contact={contact} />
          <ActionButton
            variant="secondary"
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
              className="flex items-center text-xl gap-2 mb-2"
            >
              <div>
                <detail.icon />
              </div>
              <div>{detail.text}</div>
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
