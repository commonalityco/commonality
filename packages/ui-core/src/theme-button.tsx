/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import React, { ComponentProps, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@commonalityco/ui-design-system/dropdown-menu';
import { Button } from '@commonalityco/ui-design-system/button';
import { Monitor, Sun, Moon, LucideIcon } from 'lucide-react';

interface ThemeButtonProperties
  extends Omit<ComponentProps<typeof Button>, 'label' | 'use'> {
  onThemeChange?: (theme: string) => void;
  defaultTheme?: string;
}

const IconByTheme: Record<string, LucideIcon> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

export function ThemeButton({
  onThemeChange = () => {},
  defaultTheme,
  ...properties
}: ThemeButtonProperties) {
  const [theme, setTheme] = useState(defaultTheme);
  const Icon = theme ? IconByTheme[theme] : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...properties}
          variant="ghost"
          size="icon"
          aria-label="Choose theme"
          className="group"
        >
          {Icon && (
            <Icon className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {theme && (
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => {
              setTheme(value);

              onThemeChange(value);
            }}
          >
            <DropdownMenuRadioItem value={'system'}>
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
