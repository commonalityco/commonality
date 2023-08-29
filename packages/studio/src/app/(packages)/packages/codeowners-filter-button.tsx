'use client';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  Badge,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { ChevronsUpDown, Users } from 'lucide-react';

export function CodeownersFilterButton({
  codeowners,
  onChange,
}: {
  codeowners: string[];
  onChange: (selectedCodeowners: string[]) => void;
}) {
  const [value, setValue] = useState<string[]>(codeowners);

  const handleCheckedChange = ({
    checked,
    codeowner,
  }: {
    checked: boolean;
    codeowner: string;
  }) => {
    const newCodeowners = checked
      ? Array.from(new Set([...value, codeowner]))
      : value.filter((selectedCodeowner) => selectedCodeowner !== codeowner);

    setValue(newCodeowners);
    onChange(newCodeowners);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between shrink-0 w-56">
          <div className="flex gap-2 items-center">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Codeowners</span>
            <Badge
              variant="outline"
              className="rounded-full"
            >{`${value.length}/${codeowners.length}`}</Badge>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {codeowners.length ? (
          codeowners.map((codeowner) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(event) => event.preventDefault()}
                key={codeowner}
                checked={value.some(
                  (selectedCodeowner) => selectedCodeowner === codeowner,
                )}
                onCheckedChange={(checked) =>
                  handleCheckedChange({ checked, codeowner })
                }
              >
                {codeowner}
              </DropdownMenuCheckboxItem>
            );
          })
        ) : (
          <div className="py-6 text-center">No codeowners found</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CodeownersFilterButton;
