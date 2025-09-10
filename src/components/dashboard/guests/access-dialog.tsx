"use client";
import ActionButton from "@/components/base/button-link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routes } from "@/lib/routes/routes";
import ID from "@/types/id";
import { useTranslations } from "next-intl";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { HiQrCode } from "react-icons/hi2";
import { IoLink } from "react-icons/io5";
import { toast } from "sonner";

const QR_CODE_SIZE = 256;

export default function AccessDialog({
  invitationId,
  open,
  setOpen,
}: {
  invitationId: ID;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const t = useTranslations("dashboard.event.invitations.access");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [qrCodeError, setQrCodeError] = useState<boolean>(false);

  const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${routes.rsvp.byId(invitationId)}`;
  useEffect(() => {
    if (open) {
      QRCode.toDataURL(invitationUrl, {
        width: QR_CODE_SIZE,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setQrCodeDataUrl(url);
          setQrCodeError(false);
        })
        .catch((err) => {
          console.error("QR code generation failed:", err);
          setQrCodeError(true);
        });
    }
  }, [open, invitationUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success(t("copied"));
    } catch {
      toast.error(t("failedToCopy"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <TooltipProvider>
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <HiQrCode className="h-4 w-4" />
                {t("qrCode")}
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <IoLink className="h-4 w-4" />
                {t("link")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4">
              <div className="flex justify-center">
                {qrCodeError ? (
                  <div className="w-64 h-64 border rounded-lg flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">
                      {t("failedToGenerateQR")}
                    </span>
                  </div>
                ) : qrCodeDataUrl ? (
                  <Image
                    src={qrCodeDataUrl}
                    alt="QR Code for invitation"
                    className="border rounded-lg shadow-sm"
                    width={QR_CODE_SIZE}
                    height={QR_CODE_SIZE}
                  />
                ) : (
                  <div className="w-64 h-64 border rounded-lg flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">
                      {t("generatingQR")}
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invitation-url">{t("rsvpLink")}</Label>
                <div className="flex space-x-2">
                  <Input id="invitation-url" value={invitationUrl} readOnly />
                  <ActionButton
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    tooltip={t("copyLink")}
                  >
                    <FiCopy />
                  </ActionButton>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
