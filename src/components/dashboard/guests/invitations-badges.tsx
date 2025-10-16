import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AttendanceStatus, InvitationStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { getAttendanceStatusIcon } from "./partials/attendance-status-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInvitationStatusIcon } from "./partials/invitation-status-icon";

function getInvitationBadgeVariant(status: InvitationStatus) {
  switch (status) {
    case InvitationStatus.CREATED:
      return "neutral";
    case InvitationStatus.DELIVERED:
      return "yellow";
    case InvitationStatus.ANSWERED:
      return "success";
  }
}

export function InvitationStatusBadge({
  status,
  className,
  onClick,
}: {
  status: InvitationStatus;
  className?: string;
  onClick?: (status: InvitationStatus) => void;
}) {
  const t = useTranslations("dashboard.event.invitations.status");

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => onClick?.(status)} className={cn(className)}>
            {getInvitationStatusIcon(status)}
          </TooltipTrigger>
          <TooltipContent>
            {t(status)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

function getAttendanceBadgeVariant(status: AttendanceStatus) {
  switch (status) {
    case AttendanceStatus.CONFIRMED:
      return "success";
    case AttendanceStatus.DECLINED:
      return "destructive";
    case AttendanceStatus.PENDING:
      return "neutral";
  }
}

export function AttendanceStatusBadge({
  status,
  className,
  onClick,
}: {
  status: AttendanceStatus;
  className?: string;
  onClick?: (status: AttendanceStatus) => void;
}) {
  const t = useTranslations("dashboard.event.guests.status");

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => onClick?.(status)} className={cn(className)}>
            {getAttendanceStatusIcon(status)}
          </TooltipTrigger>
          <TooltipContent>
            {t(status)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
