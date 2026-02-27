'use client'

import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-md mx-auto w-full">
      <Input
        type="text"
        placeholder="Search fashion finds..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}
