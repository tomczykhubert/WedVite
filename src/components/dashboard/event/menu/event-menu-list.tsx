import { Event, Menu } from "@prisma/client";
import EventMenuListItem from "./event-menu-list-item";
import AddEventMenuForm from "./add-event-menu-form";
import { MAX_MENU, SYSTEM_MENUS } from "@/schemas/menuFormConfig";
import ID from "@/types/id";
import { useTranslations } from "next-intl";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfirmModal from "@/components/base/confirm-modal";
import ActionButton from "@/components/base/button-link";
import { FaPlus } from "react-icons/fa";
import { TRPCResponse } from "@/trpc/routers/_app";
import { showError } from "@/lib/utils";

export default function EventMenuList({ event }: { event: Event & { menu: Menu[] } }) {
  const toAdd = SYSTEM_MENUS.filter(systemMenu => !event.menu.some((menu) => menu.system && menu.name === systemMenu.name))
  const canAddSystemMenu = toAdd.length > 0 && toAdd.length + event.menu.length <= MAX_MENU

  const sortedMenus = [...event.menu].sort((a, b) => {
    if (a.system === b.system) return 0;
    return a.system ? -1 : 1;
  });

  return (
    <div className="space-y-4">
      <div className="flex wrap items-center gap-4 justify-between">
        <h2 className="mb-0">Ustawienia menu</h2>
        {canAddSystemMenu && <AddSystemMenus eventId={event.id} />}
      </div>
      {sortedMenus.map((menu) => (
        <EventMenuListItem key={menu.id} menu={menu} />
      ))}
      {event.menu.length < MAX_MENU && <AddEventMenuForm eventId={event.id} />}
    </div>
  );
}

function AddSystemMenus({ eventId }: { eventId: ID }) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.menu.system");
  const validationT = useTranslations("formValidation");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const addSystemMenus = useMutation(
    trpc.eventMenu.addSystem.mutationOptions({
      onSuccess: async (res: TRPCResponse<string[]>) => {
        if (res.success) {
          await queryClient.invalidateQueries(trpc.event.pathFilter());
          toast.success(t("success"));
          return;
        }
        showError(validationT, res.error);
      },
      onError: () => {
        toast.error(formsT("error"));
      },
    })
  );
  const onConfirm = () => {
    addSystemMenus.mutate({ eventId });
  };

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message", { menus: SYSTEM_MENUS.map(m => t(`types.${m.name}`)).join(", ") })}
      onConfirm={onConfirm}
      confirmVariant={"default"}
      trigger={
        <ActionButton variant="default" size="sm" tooltip={t("header")}>
          <FaPlus /> {t("header")}
        </ActionButton>
      }
    />
  );
}

