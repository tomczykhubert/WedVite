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
import { cn } from "@/lib/utils";
import {
  addTableConfig,
  addTableSchema,
  MAX_GRID_SIZE,
  type AddTableData,
} from "@/schemas/tableFormConfig";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableShape } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DEFAULT_CAPACITY = 8;
const DEFAULT_ROWS = 2;
const DEFAULT_COLUMNS = 4;

function GridPicker({
  rows,
  columns,
  onSelect,
}: {
  rows: number;
  columns: number;
  onSelect: (rows: number, columns: number) => void;
}) {
  const t = useTranslations("dashboard.event.tables");
  const [hoverRows, setHoverRows] = useState(-1);
  const [hoverColumns, setHoverColumns] = useState(-1);

  const displayRows = hoverRows >= 0 ? hoverRows + 1 : rows;
  const displayColumns = hoverColumns >= 0 ? hoverColumns + 1 : columns;

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-muted/30">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${MAX_GRID_SIZE}, 1fr)` }}
          onMouseLeave={() => {
            setHoverRows(-1);
            setHoverColumns(-1);
          }}
        >
          {Array.from({ length: MAX_GRID_SIZE * MAX_GRID_SIZE }).map(
            (_, index) => {
              const row = Math.floor(index / MAX_GRID_SIZE);
              const col = index % MAX_GRID_SIZE;
              const isSelected = row < rows && col < columns;
              const isHovered =
                hoverRows >= 0 &&
                hoverColumns >= 0 &&
                row <= hoverRows &&
                col <= hoverColumns;

              return (
                <div
                  key={index}
                  className={cn(
                    "w-6 h-6 border-2 cursor-pointer transition-colors",
                    isSelected && "bg-primary border-primary",
                    !isSelected &&
                      isHovered &&
                      "bg-primary/30 border-primary/50",
                    !isSelected &&
                      !isHovered &&
                      "bg-background border-muted-foreground/30"
                  )}
                  onMouseEnter={() => {
                    setHoverRows(row);
                    setHoverColumns(col);
                  }}
                  onClick={() => onSelect(row + 1, col + 1)}
                />
              );
            }
          )}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {displayRows} × {displayColumns}
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        {t("clickToSelect")}
      </div>
    </div>
  );
}

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
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const createTable = useMutation(
    trpc.table.createTable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.table.pathFilter());
        toast.success(t("tableAdded"));
        form.reset();
        onOpenChange(false);
        onSuccess();
      },
      onError: () => {
        toast.error(t("tableFailed"));
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      },
    })
  );

  const form = useForm<AddTableData>({
    resolver: zodResolver(addTableSchema),
    defaultValues: {
      name: "",
      shape: TableShape.ROUND,
      capacity: DEFAULT_CAPACITY,
      rows: DEFAULT_ROWS,
      columns: DEFAULT_COLUMNS,
    },
  });

  const selectedShape = form.watch("shape");
  const rows = form.watch("rows") || 0;
  const columns = form.watch("columns") || 0;

  const calculatedSeats = rows > 0 && columns > 0 ? columns * 2 + rows * 2 : 0;

  const onSubmit = (data: AddTableData) => {
    const submitData = {
      ...data,
      eventId,
    };

    createTable.mutate(submitData);
  };

  const handleGridSelect = (newRows: number, newColumns: number) => {
    form.setValue("rows", newRows);
    form.setValue("columns", newColumns);
    form.setValue("capacity", newRows * 2 + newColumns * 2);
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
