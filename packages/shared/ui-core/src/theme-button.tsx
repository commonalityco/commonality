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
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from '@commonalityco/ui-design-system/tooltip';
import { Button } from '@commonalityco/ui-design-system/button';
import { Monitor, Sun, Moon, LucideIcon } from 'lucide-react';
import { cn } from '@commonalityco/ui-design-system/cn';

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
  defaultTheme = 'system',
  className,
  ...properties
}: ThemeButtonProperties) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const Icon = theme ? IconByTheme[theme] : undefined;

  return (
    <DropdownMenu onOpenChange={() => setIsTooltipOpen(false)}>
      <TooltipProvider>
        <Tooltip
          open={isTooltipOpen}
          onOpenChange={setIsTooltipOpen}
          delayDuration={200}
        >
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                {...properties}
                variant="ghost"
                size="icon"
                aria-label="Choose theme"
                className={cn('group', className)}
              >
                {Icon && (
                  <Icon className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
                )}
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>

          <TooltipContent align="center" side="bottom" alignOffset={8}>
            Change theme
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
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
