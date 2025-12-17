import { InvitationStatus } from "@prisma/client";
import {
  FaPenToSquare,
  FaRegEnvelope,
  FaRegEnvelopeOpen,
} from "react-icons/fa6";

export function getInvitationStatusIcon(
  status: InvitationStatus,
  size: "small" | "default" = "default"
) {
  switch (status) {
    case InvitationStatus.ANSWERED:
      return (
        <FaRegEnvelopeOpen
          className={`text-green-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case InvitationStatus.CREATED:
      return (
        <FaPenToSquare
          className={`text-gray-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case InvitationStatus.DELIVERED:
      return (
        <FaRegEnvelope
          className={`text-yellow-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    default:
      return null;
  }
}
