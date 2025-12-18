import { AttendanceStatus } from "@prisma/client";
import { Check, HelpCircle, X } from "lucide-react";

export function getAttendanceStatusIcon(
  status: AttendanceStatus,
  size: "small" | "default" = "default"
) {
  switch (status) {
    case AttendanceStatus.CONFIRMED:
      return (
        <Check
          className={`text-green-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case AttendanceStatus.DECLINED:
      return (
        <X
          className={`text-red-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case AttendanceStatus.PENDING:
      return (
        <HelpCircle
          className={`text-yellow-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    default:
      return null;
  }
}
