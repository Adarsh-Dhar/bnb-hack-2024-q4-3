// components/StatusCombobox.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getStatusColor } from '../utils/statusColors'
import { KeyStatus } from '../types/types'

const statuses: { value: KeyStatus; label: string }[] = [
  { value: "Active", label: "Active" },
  { value: "Revoked", label: "Revoked" },
  { value: "Expired", label: "Expired" },
  { value: "Compromised", label: "Compromised" },
  { value: "Archived", label: "Archived" },
  { value: "Not Initialized", label: "Not Initialized" }
]

interface StatusComboboxProps {
  currentStatus: KeyStatus;
  onStatusChange: (status: KeyStatus) => void;
}

export function Status({ currentStatus, onStatusChange }: StatusComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between p-0"
        >
          <Badge className={getStatusColor(currentStatus)}>
            {currentStatus}
          </Badge>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." className="h-9" />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => {
                    onStatusChange(status.value);
                    setOpen(false);
                  }}
                >
                  <Badge className={getStatusColor(status.value)}>
                    {status.label}
                  </Badge>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStatus === status.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}