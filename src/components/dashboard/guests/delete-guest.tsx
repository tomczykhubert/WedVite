import ConfirmModal from "@/components/base/confirm-modal";
import { useTRPC } from "@/trpc/client";
import ID from "@/types/id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DeleteGuest({
  guestId,
  open,
  setOpen,
}: {
  guestId: ID;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.event.guests.delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteGuest = useMutation(
    trpc.guest.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.invitation.pathFilter());
        toast.success(formsT("success"));
      },
      onError: () => {
        toast.error(formsT("error"));
      },
    })
  );
  const onConfirm = () => {
    deleteGuest.mutate({ id: guestId });
    setOpen(false);
  };

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message")}
      onConfirm={onConfirm}
      open={open}
      onCancel={() => setOpen(false)}
    />
  );
}
