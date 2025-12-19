"use client";

import { Monitor } from "lucide-react";
import { useTranslations } from "next-intl";

export function MobileWarning() {
  const t = useTranslations("dashboard.event.tables");

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Monitor className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{t("desktop.title")}</h3>
      <p className="text-muted-foreground max-w-md">
        {t("desktop.description")}
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        {t("desktop.mobileNote")}
      </p>
    </div>
  );
}
