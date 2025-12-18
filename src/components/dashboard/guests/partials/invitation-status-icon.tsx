import { InvitationStatus } from "@prisma/client";
import { Mail, MailOpen, PenSquare } from "lucide-react";

export function getInvitationStatusIcon(
  status: InvitationStatus,
  size: "small" | "default" = "default"
) {
  switch (status) {
    case InvitationStatus.ANSWERED:
      return (
        <MailOpen
          className={`text-green-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case InvitationStatus.CREATED:
      return (
        <PenSquare
          className={`text-gray-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case InvitationStatus.DELIVERED:
      return (
        <Mail
          className={`text-yellow-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    default:
      return null;
  }
}
