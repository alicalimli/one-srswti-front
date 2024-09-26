import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { MultiSelectType } from "@/lib/types";

interface MultiSelectProps {
  data: MultiSelectType[];
  initialSelections: MultiSelectType[];
  setSelection: (state: MultiSelectType[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  data: INITIAL_OPTIONS,
  initialSelections,
  setSelection,
  placeholder,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] =
    React.useState<MultiSelectType[]>(initialSelections);
  const [inputValue, setInputValue] = React.useState("");

  const data = INITIAL_OPTIONS.filter(
    (option) =>
      !initialSelections.some((selection) => selection.id === option.id)
  );

  React.useEffect(() => {
    setSelection(selected);
  }, [selected]);

  const handleUnselect = React.useCallback((data: MultiSelectType) => {
    console.log(data.id);
    setSelected((prev) => prev.filter((s) => s.id !== data.id));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = data.filter((d) => !selected.includes(d));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group bg-[#252525] rounded-[12px] px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((data) => {
            return (
              <Badge
                key={data.id}
                variant="secondary"
                className="bg-[#151515] rounded-[6px]"
              >
                {data.label}
                <button
                  type="button"
                  className="ml-1 rounded-full bg-[#555] outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(data);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(data)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder || "placeholder"}
            className="ml-2 flex-1 outline-none placeholder:text-white/70 bg-transparent"
          />
        </div>
      </div>
      <div className=" mt-2  z-10">
        <CommandList className="scrollbar-hide">
          {open && selectables.length > 0 ? (
            <div className=" top-0 z-10 w-full scrollbar-hide rounded-[12px] border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((data) => {
                  return (
                    <CommandItem
                      key={data.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, data]);
                      }}
                      className={"cursor-pointer rounded-[6px]"}
                    >
                      {data.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
