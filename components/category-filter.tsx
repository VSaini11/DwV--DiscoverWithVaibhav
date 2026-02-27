'use client'

import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map(category => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant={activeCategory === category ? 'default' : 'outline'}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === category
              ? 'bg-primary text-primary-foreground'
              : 'bg-transparent text-foreground border border-border hover:border-foreground'
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
