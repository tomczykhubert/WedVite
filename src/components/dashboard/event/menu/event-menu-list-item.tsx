import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { useTRPC } from "@/trpc/client";
import { Menu } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { MenuIcon } from "./menu-icon";
import UpdateEventMenuForm from "./update-event-menu-form";

export default function EventMenuListItem({ menu }: { menu: Menu }) {
  const t = useTranslations("dashboard.forms.menu");
  return (
    <div className="flex gap-2 items-center justify-between p-4 border rounded-md">
      <div className="flex gap-2 items-center">
        <MenuIcon color={menu.color} />
        <span className="whitespace-normal [overflow-wrap:anywhere] mb-0">
          {menu.system ? t(`system.types.${menu.name}`) : menu.name}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <MarkEventMenuAsDefault menu={menu} />
        {!menu.system && <UpdateEventMenuForm menu={menu} />}
        <DeleteEventMenu menu={menu} />
      </div>
    </div>
  );
}

function DeleteEventMenu({ menu }: { menu: Menu }) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.menu.delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMenu = useMutation(
    trpc.eventMenu.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.event.pathFilter());
        toast.success(t("success"));
      },
      onError: () => {
        toast.error(formsT("error"));
      },
    })
  );
  const onConfirm = () => {
    deleteMenu.mutate({ id: menu.id });
  };

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message")}
      onConfirm={onConfirm}
      trigger={
        <ActionButton variant="destructive" size="sm" tooltip={t("header")}>
          <Trash2 />
        </ActionButton>
      }
    />
  );
}

function MarkEventMenuAsDefault({ menu }: { menu: Menu }) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.menu.default");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMenu = useMutation(
    trpc.eventMenu.markDefault.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.event.pathFilter());
        toast.success(t("success"));
      },
      onError: () => {
        toast.error(formsT("error"));
      },
    })
  );
  const onConfirm = () => {
    deleteMenu.mutate({ id: menu.id, eventId: menu.eventId });
  };

  if (menu.default) {
    return (
      <span className="text-green-500 px-2.5">
        <Check />
      </span>
    );
  }

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message")}
      onConfirm={onConfirm}
      confirmVariant={"default"}
      trigger={
        <ActionButton variant="outline" size="sm" tooltip={t("header")}>
          <Check />
        </ActionButton>
      }
    />
  );
}
