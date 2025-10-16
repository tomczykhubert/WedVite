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
import { VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import React from "react";
import { buttonVariants } from "../ui/button";

interface ModalProps {
  header: string;
  message: string;
  cancel?: string;
  confirm?: string;
  open?: boolean;
  trigger?: React.ReactElement;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?:  VariantProps<typeof buttonVariants>["variant"]
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
  confirmVariant
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
          <AlertDialogAction onClick={onConfirm} variant={confirmVariant}>
            {confirm ? confirm : t("yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
