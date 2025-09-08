import { Input } from "@/components/ui/input";
import { cn, getEnumKeys } from "@/lib/utils";
import { AttendanceStatus, InvitationStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  AttendanceStatusBadge,
  InvitationStatusBadge,
} from "./invitations-badges";
import { useInvitations } from "./invitations-context";

export default function InvitationsTableFilters() {
  const { filters, updateFilter } = useInvitations();

  return (
    <div className="flex justify-end gap-3 items-end mb-4 flex-wrap">
      <InvitationStatusFilter
        value={filters.invitationStatus}
        setValue={(value) => {
          updateFilter("invitationStatus", value);
        }}
      />
      <AttendanceStatusFilter
        value={filters.attendanceStatus}
        setValue={(value) => {
          updateFilter("attendanceStatus", value);
        }}
      />
      <SearchBox className="max-w-[500px] grow" />
    </div>
  );
}

function SearchBox({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { filters, updateFilter } = useInvitations();
  const [query, setQuery] = useState(filters.name ?? "");
  const t = useTranslations("dashboard.event.guests");
  const handleSearch = useDebouncedCallback((search: string) => {
    updateFilter("name", search);
  }, 1000);

  const handleInput = (value: string) => {
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Input
        placeholder={t("search")}
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}

type InvitationStatusFilterProps = {
  value?: InvitationStatus;
  setValue: (value?: InvitationStatus) => void;
};

function InvitationStatusFilter({
  value,
  setValue,
}: InvitationStatusFilterProps) {
  const t = useTranslations("dashboard.event.invitations");

  return (
    <div>
      <p className="text-sm">{t("invitationStatus")}:</p>
      <div className="flex items-center gap-2">
        {getEnumKeys(InvitationStatus).map((status) => (
          <InvitationStatusBadge
            status={status}
            className={cn("cursor-pointer", value != status && "opacity-50")}
            onClick={() => {
              if (value == status) {
                setValue(undefined);
              } else {
                setValue(status);
              }
            }}
            key={status}
          />
        ))}
      </div>
    </div>
  );
}

type AttendanceStatusFilterProps = {
  value?: AttendanceStatus;
  setValue: (value?: AttendanceStatus) => void;
};

function AttendanceStatusFilter({
  value,
  setValue,
}: AttendanceStatusFilterProps) {
  const t = useTranslations("dashboard.event.guests");

  return (
    <div>
      <p className="text-sm">{t("attendanceStatus")}:</p>
      <div className="flex items-center gap-2">
        {getEnumKeys(AttendanceStatus).map((status) => (
          <AttendanceStatusBadge
            status={status}
            className={cn("cursor-pointer", value != status && "opacity-50")}
            onClick={() => {
              if (value == status) {
                setValue(undefined);
              } else {
                setValue(status);
              }
            }}
            key={status}
          />
        ))}
      </div>
    </div>
  );
}
