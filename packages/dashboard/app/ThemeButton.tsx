'use client';
import { Logo } from '@/images/logo';
import { Section } from '@commonalityco/ui-section';
import './globals.css';
import 'reactflow/dist/style.css';
import { Inter, Fira_Code, Vollkorn } from '@next/font/google';
import { clsx } from 'clsx';
import { ReactFlowProvider } from 'reactflow';
import { IconButton } from '@commonalityco/ui-icon-button';
import {
  faCheck,
  faDesktop,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import * as DropdownMenu from '@commonalityco/ui-dropdown-menu';
import { Icon } from '@commonalityco/ui-icon';
import { useTheme, ThemeName } from '@/hooks/useTheme';

const IconByThemeName = {
  [ThemeName.Dark]: faMoon,
  [ThemeName.Light]: faSun,
  [ThemeName.System]: faDesktop,
};

function ThemeButton() {
  const { theme, setTheme } = useTheme();

  const icon = IconByThemeName[theme];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {icon && <IconButton use="ghost" icon={icon} />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end">
          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={(newTheme) => setTheme(newTheme as ThemeName)}
          >
            <DropdownMenu.RadioItem value={ThemeName.System}>
              <div className="flex items-center gap-2">
                <Icon icon={faDesktop} className="w-3" size="1x" />
                System
                <DropdownMenu.ItemIndicator>
                  <Icon icon={faCheck} />
                </DropdownMenu.ItemIndicator>
              </div>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value={ThemeName.Light}>
              <div className="flex items-center gap-2">
                <Icon icon={faSun} className="w-3" />
                Light
                <DropdownMenu.ItemIndicator>
                  <Icon icon={faCheck} />
                </DropdownMenu.ItemIndicator>
              </div>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value={ThemeName.Dark}>
              <div className="flex items-center gap-2">
                <Icon icon={faMoon} className="w-3" />
                Dark
                <DropdownMenu.ItemIndicator>
                  <Icon icon={faCheck} />
                </DropdownMenu.ItemIndicator>
              </div>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default ThemeButton;
