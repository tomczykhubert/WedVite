import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { useTRPC } from "@/trpc/client";
import { Menu } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FaCheck, FaTrash } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { toast } from "sonner";
import UpdateEventMenuForm from "./update-event-menu-form";

export default function EventMenuListItem({
  menu,
}: {
  menu: Menu;
}) {
  const t = useTranslations("dashboard.forms.menu");
  return (
    <div className="flex gap-2 items-center justify-between p-4 border rounded-md">
      <div className="flex gap-2 items-center">
        <div className="rounded-full flex items-center justify-center p-2" style={{ backgroundColor: menu.color }}>
          <IoFastFoodSharp className="text-white"/>
        </div>
        <span className="whitespace-normal [overflow-wrap:anywhere] mb-0">
          {menu.system ? t(`system.types.${menu.name}`) : menu.name }
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
          <FaTrash />
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

  if(menu.default) {
    return <span className="text-green-500 px-2.5"><FaCheck /></span>
  }

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message")}
      onConfirm={onConfirm}
      confirmVariant={"default"}
      trigger={
        <ActionButton variant="outline" size="sm" tooltip={t("header")}>
          <FaCheck />
        </ActionButton>
      }
    />
  );
}
