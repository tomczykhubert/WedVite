import { ChevronDownIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import React from "react";

export default function DatePicker({ ...field }: ControllerRenderProps<FieldValues, string>) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker"
          className="w-32 justify-between font-normal"
        >
          {field.value ? field.value.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={field.value as Date}
          onSelect={(date) => {
            field.onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}