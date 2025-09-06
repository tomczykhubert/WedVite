import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AttendanceStatus, InvitationStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

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
  onClick
}: { status: InvitationStatus, className?: string, onClick?: (status: InvitationStatus) => void }) {
  const t = useTranslations("dashboard.event.invitations.status")


  return (<>
    <Badge className={cn(className)} variant={getInvitationBadgeVariant(status)} onClick={() => onClick?.(status)}>{t(status.toLowerCase())}</Badge>
  </>
  )
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
  onClick
}: { status: AttendanceStatus, className?: string, onClick?: (status: AttendanceStatus) => void }) {
  const t = useTranslations("dashboard.event.guests.status")

  return (<>
    <Badge className={cn(className)} variant={getAttendanceBadgeVariant(status)} onClick={() => onClick?.(status)}>{t(status.toLowerCase())}</Badge>
  </>
  )
}