import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormFieldConfig } from "@/lib/forms/schemaTranslator";
import { cn } from "@/lib/utils";
import { countries } from "country-data-list";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import pl from "react-phone-number-input/locale/pl";

type Labels = Record<string, string>;

const loadTranslations = async (locale: string) => {
  try {
    return await import(
      `/node_modules/react-phone-number-input/locale/${locale}.json`
    );
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    return pl;
  }
};

export const CountryPicker = ({
  disabled,
  value: selectedCountry,
  onChange,
  fieldConfig,
}: {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (country: RPNInput.Country | null) => void;
  fieldConfig: FormFieldConfig;
}) => {
  const locale = useLocale();
  const t = useTranslations("base.forms");
  const [labels, setLabels] = React.useState<Labels>(pl);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const loadLabels = async () => {
      try {
        const result = await loadTranslations(locale);
        setLabels(result);
      } catch (error) {
        console.error(`Failed to load dictionary for locale: ${locale}`, error);
      }
    };

    loadLabels();
  }, [locale]);

  const countryList = Object.entries(labels)
    .map(([code, name]) => ({ value: code, label: name }))
    .filter(
      (item) =>
        item.value.length == 2 && availableCountries.includes(item.value)
    )
    .filter((item): item is { value: RPNInput.Country; label: string } =>
      isCountry(item.value)
    )
    .filter(({ value }) => value)
    .sort((a, b) => a.label.localeCompare(b.label));

  const filteredOptions = countryList.filter(({ label }) =>
    label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedLabel = labels[selectedCountry];

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full flex justify-between items-center px-3 rounded-lg"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            {selectedCountry && <Flag country={selectedCountry} />}
            <span className="text-sm">
              {selectedLabel || t("selectCountry")}
            </span>
          </div>
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={t("selectCountry")}
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              setTimeout(() => {
                const viewport = scrollAreaRef.current?.querySelector(
                  "[data-radix-scroll-area-viewport]"
                );
                if (viewport) viewport.scrollTop = 0;
              }, 0);
            }}
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>{t("noCountryFound")}</CommandEmpty>
              <CommandGroup>
                {!fieldConfig.required && (
                  <CommandItem
                    className="gap-2"
                    onSelect={() => {
                      onChange(null);
                      setIsOpen(false);
                    }}
                  >
                    <span className="w-6"></span>
                    <span className="flex-1 text-sm">{t("selectNone")}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4",
                        null === selectedCountry ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )}
                {filteredOptions.map(({ value, label }) => (
                  <CommandItem
                    key={value}
                    className="gap-2"
                    onSelect={() => {
                      onChange(value);
                      setIsOpen(false);
                    }}
                  >
                    <Flag country={value} />
                    <span className="flex-1 text-sm">{label}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4",
                        value === selectedCountry ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const Flag = ({ country }: { country: RPNInput.Country }) => {
  const FlagIcon = flags[country];
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {FlagIcon && <FlagIcon title={country} />}
    </span>
  );
};

export const availableCountries = Object.values(countries.all).map(
  (c) => c.alpha2
);

function isCountry(value: unknown): value is RPNInput.Country {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof value === "string" && availableCountries.includes(value as any);
}
