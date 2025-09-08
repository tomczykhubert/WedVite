import ConfirmModal from "@/components/base/confirm-modal";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DeleteInvitation({
  invitationId,
  open,
  setOpen,
}: {
  invitationId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.event.invitations.delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteInvitation = useMutation(
    trpc.invitation.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.invitation.pathFilter());
        toast.success(formsT("success"));
      },
      onError: (err) => {
        toast.error(formsT("error"));
      },
    })
  );
  const onConfirm = () => {
    deleteInvitation.mutate({ id: invitationId });
    setOpen(false);
  };

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message")}
      onConfirm={onConfirm}
      onCancel={() => setOpen(false)}
      open={open}
    />
  );
}
