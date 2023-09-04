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
import { ChevronsUpDown, ExternalLink, Users } from 'lucide-react';

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
      ? [...new Set([...value, codeowner])]
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
        {codeowners.length > 0 ? (
          codeowners.map((codeowner) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(event) => event.preventDefault()}
                key={codeowner}
                checked={value.includes(codeowner)}
                onCheckedChange={(checked) =>
                  handleCheckedChange({ checked, codeowner })
                }
              >
                {codeowner}
              </DropdownMenuCheckboxItem>
            );
          })
        ) : (
          <div className="p-3">
            <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
              <div className="bg-secondary rounded-full p-1.5">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <p className="font-medium mb-1">Assign ownership</p>
            <p className="text-muted-foreground text-xs">
              Create a <span className="font-mono">CODEOWNERS</span> file to
              assign ownership of packages in your project
            </p>

            <Button asChild variant="secondary" className="w-full mt-3">
              <a
                className="space-x-1"
                target="_blank"
                rel="noopener noreferrer"
                href="https://commonality.co/docs/codeowners"
              >
                <span>Learn more</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CodeownersFilterButton;
