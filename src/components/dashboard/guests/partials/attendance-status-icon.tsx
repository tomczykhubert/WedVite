import { AttendanceStatus } from "@prisma/client";
import { FaQuestion } from "react-icons/fa";
import { LuCheck, LuX } from "react-icons/lu";

export function getAttendanceStatusIcon(
  status: AttendanceStatus,
  size: "small" | "default" = "default"
) {
  switch (status) {
    case AttendanceStatus.CONFIRMED:
      return (
        <LuCheck
          className={`text-green-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case AttendanceStatus.DECLINED:
      return (
        <LuX
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
