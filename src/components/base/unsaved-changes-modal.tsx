import { useTranslations } from "next-intl";
import React from "react";
import ConfirmModal from "./confirm-modal";

interface ModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const UnsavedChangesModal: React.FC<ModalProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  const t = useTranslations("base");

  return (
    <ConfirmModal
      onConfirm={onConfirm}
      onCancel={onCancel}
      open={open}
      header={t("unconfirmedChanges.header")}
      message={t("unconfirmedChanges.message")}
      confirm={t("unconfirmedChanges.confirm")}
      cancel={t("unconfirmedChanges.cancel")}
    />
  );
};

export default UnsavedChangesModal;
