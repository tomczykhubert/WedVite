import { useFormatter, useTranslations } from "next-intl";
import React from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { LuCalendar } from "react-icons/lu";
import { Calendar } from "./calendar";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { cn } from "@/lib/utils";

export default function DateTimePicker({
  ...field
}: ControllerRenderProps<FieldValues, string>) {
  const t = useTranslations('base.forms')
  const [date, setDate] = React.useState<Date>(field.value);
  const [isOpen, setIsOpen] = React.useState(false);
  const format = useFormatter();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      selectedDate.setHours(date.getHours(), date.getMinutes())
      setDate(selectedDate);
      field.onChange(selectedDate)
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setDate(newDate);
      field.onChange(newDate)
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <LuCalendar className="mr-2 h-4 w-4" />
            {date? (
              format.dateTime(date, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })
            ) : (
              <span>{t('selectDate')}</span>
            )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={date && date.getHours() === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 60 }, (_, i) => i ).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}