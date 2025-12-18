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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableShape } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Circle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addTableSchema = z
  .object({
    name: z.string().min(1, "Table name is required"),
    shape: z.nativeEnum(TableShape),
    capacity: z.coerce.number().min(2).max(50),
    rows: z.coerce.number().min(1).max(10).optional(),
    columns: z.coerce.number().min(1).max(10).optional(),
  })
  .refine(
    (data) => {
      if (data.shape === TableShape.RECTANGULAR) {
        return data.rows && data.columns;
      }
      return true;
    },
    {
      message: "Rows and columns are required for rectangular tables",
      path: ["rows"],
    }
  );

type AddTableForm = z.infer<typeof addTableSchema>;

interface AddTableDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MAX_GRID_SIZE = 10;

function GridPicker({
  rows,
  columns,
  onSelect,
}: {
  rows: number;
  columns: number;
  onSelect: (rows: number, columns: number) => void;
}) {
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
        Click to select table dimensions (rows × columns)
      </div>
    </div>
  );
}

export function AddTableDialog({
  eventId,
  open,
  onOpenChange,
  onSuccess,
}: AddTableDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const createTable = useMutation(
    trpc.table.createTable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.table.pathFilter());
        toast.success("Table added successfully");
        form.reset();
        onOpenChange(false);
        onSuccess();
      },
      onError: () => {
        toast.error("Failed to add table");
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      },
    })
  );

  const form = useForm<AddTableForm>({
    resolver: zodResolver(addTableSchema),
    defaultValues: {
      name: "",
      shape: TableShape.ROUND,
      capacity: 8,
      rows: 2,
      columns: 4,
    },
  });

  const selectedShape = form.watch("shape");
  const rows = form.watch("rows") || 0;
  const columns = form.watch("columns") || 0;

  // Calculate seats for rectangular table: 2 long sides + 2 short sides
  const calculatedSeats = rows > 0 && columns > 0 ? columns * 2 + rows * 2 : 0;

  const onSubmit = (data: AddTableForm) => {
    const submitData = {
      eventId,
      name: data.name,
      shape: data.shape,
      capacity:
        data.shape === TableShape.RECTANGULAR ? calculatedSeats : data.capacity,
      rows: data.shape === TableShape.RECTANGULAR ? data.rows : undefined,
      columns: data.shape === TableShape.RECTANGULAR ? data.columns : undefined,
    };

    createTable.mutate(submitData);
  };

  const handleGridSelect = (newRows: number, newColumns: number) => {
    form.setValue("rows", newRows);
    form.setValue("columns", newColumns);
  };

  return (
    <>
      <Loader isLoading={loading} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Table</DialogTitle>
            <DialogDescription>
              Create a new table for your seating arrangement
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Table 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shape</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TableShape.ROUND}>
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            Round
                          </div>
                        </SelectItem>
                        <SelectItem value={TableShape.RECTANGULAR}>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-5 border border-current" />
                            Rectangular
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedShape === TableShape.ROUND && (
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Seats</FormLabel>
                      <FormControl>
                        <Input type="number" min={2} max={50} {...field} />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground">
                        Recommended: 6-10 seats for optimal spacing
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {selectedShape === TableShape.RECTANGULAR && (
                <>
                  <FormItem>
                    <FormLabel>Table Dimensions</FormLabel>
                    <GridPicker
                      rows={rows}
                      columns={columns}
                      onSelect={handleGridSelect}
                    />
                    <FormMessage />
                  </FormItem>

                  {rows > 0 && columns > 0 && (
                    <div className="rounded-lg bg-muted p-3 space-y-1">
                      <div className="text-sm font-medium">
                        Selected: {rows} × {columns}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total seats:{" "}
                        <span className="font-semibold text-foreground">
                          {calculatedSeats}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ({columns} seats on each long side + {rows} seats on
                        each short side)
                      </div>
                    </div>
                  )}
                </>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Table"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
