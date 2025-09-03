import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import React from "react";

interface ModalProps {
  header: string;
  message: string;
  cancel?: string;
  confirm?: string;
  open?: boolean;
  trigger?: React.ReactElement;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmModal: React.FC<ModalProps> = ({
  header,
  message,
  cancel,
  confirm,
  open,
  trigger,
  onConfirm,
  onCancel,
}) => {
  const t = useTranslations("base");

  return (
    <AlertDialog open={open}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{header}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancel ? cancel : t("no")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirm ? confirm : t("yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
