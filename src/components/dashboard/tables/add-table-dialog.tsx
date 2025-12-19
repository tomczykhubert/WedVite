"use client";

import { Loader } from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AutoFormField,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  addTableConfig,
  addTableSchema,
  type AddTableData,
} from "@/schemas/tableFormConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableShape } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  calculateRectangularSeats,
  DEFAULT_CAPACITY,
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
} from "./constants";
import { GridPicker } from "./grid-picker";
import { useTableMutations } from "./hooks/useTableMutations";
import { useTablePosition } from "./hooks/useTablePosition";
import { useTablePlanner } from "./table-planner-context";

interface AddTableDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTableDialog({
  eventId,
  open,
  onOpenChange,
  onSuccess,
}: AddTableDialogProps) {
  const baseT = useTranslations("base.forms");
  const t = useTranslations("dashboard.event.tables");
  const [loading, setLoading] = useState(false);
  const { pan, zoom, canvasRef } = useTablePlanner();
  const { createTable } = useTableMutations(eventId);

  const form = useForm<AddTableData>({
    resolver: zodResolver(addTableSchema),
    defaultValues: {
      name: "",
      shape: TableShape.ROUND,
      capacity: DEFAULT_CAPACITY,
      rows: DEFAULT_ROWS,
      columns: DEFAULT_COLUMNS,
      positionX: 0,
      positionY: 0,
    },
  });

  const selectedShape = form.watch("shape");
  const rows = form.watch("rows") ?? DEFAULT_ROWS;
  const columns = form.watch("columns") ?? DEFAULT_COLUMNS;

  const canvasSize = canvasRef.current
    ? {
        width: canvasRef.current.getBoundingClientRect().width,
        height: canvasRef.current.getBoundingClientRect().height,
      }
    : { width: 0, height: 0 };

  useTablePosition({
    open,
    form,
    selectedShape,
    rows,
    columns,
    canvasSize,
    pan,
    zoom,
  });

  const calculatedSeats =
    rows > 0 && columns > 0 ? calculateRectangularSeats(rows, columns) : 0;

  const onSubmit = async (data: AddTableData) => {
    const submitData = {
      ...data,
      eventId,
    };

    setLoading(true);
    try {
      await createTable.mutateAsync(submitData);
      toast.success(t("tableAdded"));
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error(t("tableFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGridSelect = (newRows: number, newColumns: number) => {
    form.setValue("rows", newRows);
    form.setValue("columns", newColumns);
    form.setValue("capacity", calculateRectangularSeats(newRows, newColumns));
  };

  return (
    <>
      <Loader isLoading={loading} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("add")}</DialogTitle>
            <DialogDescription>{t("addDescription")}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {addTableConfig.map((fieldConfig) => {
                if (
                  selectedShape === TableShape.RECTANGULAR &&
                  fieldConfig.name === "capacity"
                ) {
                  return null;
                }

                if (
                  selectedShape === TableShape.ROUND &&
                  (fieldConfig.name === "rows" ||
                    fieldConfig.name === "columns")
                ) {
                  return null;
                }

                if (
                  selectedShape === TableShape.RECTANGULAR &&
                  fieldConfig.name === "rows"
                ) {
                  return (
                    <FormItem key={fieldConfig.name}>
                      <FormLabel>{t("tableDimensions")}</FormLabel>
                      <GridPicker
                        rows={rows}
                        columns={columns}
                        onSelect={handleGridSelect}
                      />
                      <FormMessage />
                      {rows > 0 && columns > 0 && (
                        <div className="rounded-lg bg-muted p-3 space-y-1">
                          <div className="text-sm font-medium">
                            {t("selected", { rows, columns })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("totalSeats")}{" "}
                            <span className="font-semibold text-foreground">
                              {calculatedSeats}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("seatsInfo", { rows, columns })}
                          </div>
                        </div>
                      )}
                    </FormItem>
                  );
                }

                if (fieldConfig.name === "columns") {
                  return null;
                }

                return (
                  <AutoFormField
                    key={fieldConfig.name}
                    control={form.control}
                    fieldConfig={fieldConfig}
                  />
                );
              })}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  {baseT("cancel")}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? t("adding") : t("add")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
