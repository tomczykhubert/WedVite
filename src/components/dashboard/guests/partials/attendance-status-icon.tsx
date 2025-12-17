import { AttendanceStatus } from "@prisma/client";
import { FaCheck, FaQuestion, FaX } from "react-icons/fa6";

export function getAttendanceStatusIcon(
  status: AttendanceStatus,
  size: "small" | "default" = "default"
) {
  switch (status) {
    case AttendanceStatus.CONFIRMED:
      return (
        <FaCheck
          className={`text-green-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case AttendanceStatus.DECLINED:
      return (
        <FaX
          className={`text-red-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case AttendanceStatus.PENDING:
      return (
        <FaQuestion
          className={`text-yellow-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    default:
      return null;
  }
}
