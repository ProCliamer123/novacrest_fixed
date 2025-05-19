"use client"

import type { Theme } from "@/utils/pdf-themes"

interface PdfThemeSelectorProps {
  themes: Theme[]
  activeTheme: Theme
  onSelectTheme: (theme: Theme) => void
}

export default function PdfThemeSelector({ themes, activeTheme, onSelectTheme }: PdfThemeSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Document Theme</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => onSelectTheme(theme)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              activeTheme.name === theme.name ? "ring-2 ring-offset-2 ring-black" : ""
            }`}
            style={{
              backgroundColor: theme.primaryColor,
              borderColor: theme.secondaryColor,
            }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  )
}
