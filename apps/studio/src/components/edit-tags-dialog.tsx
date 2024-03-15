'use client';
import {
  CreatebleSelect,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  DialogDescription,
  toast,
} from '@commonalityco/ui-design-system';
import { formatTagName } from '@commonalityco/utils-core';
import React, { ComponentProps, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { setTagsAction } from '@/actions/metadata';
import { useAtom, useAtomValue } from 'jotai';
import { editingPackageAtom } from '@/atoms/graph-atoms';
import { useRouter } from 'next/navigation';
import { TagsData } from '@commonalityco/types';

const formSchema = z.object({
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
});

export function EditTagsDialogContent({ tagsData }: { tagsData: TagsData[] }) {
  const router = useRouter();

  const editingPackage = useAtomValue(editingPackageAtom);

  const [isPending, startTransition] = useTransition();

  const allTags = [...new Set(tagsData.map((data) => data.tags).flat())];
  const pkgTags = tagsData.find(
    (data) => data.packageName === editingPackage?.name,
  )?.tags;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: pkgTags?.map((existingTag) => ({
        value: existingTag,
        label: formatTagName(existingTag),
      })),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!editingPackage) return;

    const newTags = values.tags.map((item) => item.value);

    startTransition(async () => {
      const configPath = await setTagsAction({
        pkg: editingPackage,
        tags: newTags,
      });
      router.refresh();

      toast.success('Tags updated', {
        description: configPath,
      });
    });
  }

  if (!editingPackage) return;

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit tags</DialogTitle>
          <DialogDescription>
            {`We will create or update the`}
            <span className="text-foreground mx-1 font-medium">
              commonality.json
            </span>
            file for{' '}
            <span className="text-foreground font-medium">
              {editingPackage.name}
            </span>{' '}
            with the tags you select.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tags"
              render={({ field: { onChange, value, name, ref } }) => (
                <FormItem>
                  <FormControl>
                    <CreatebleSelect
                      isMulti
                      placeholder="Search or create tags..."
                      noOptionsMessage={() =>
                        'Start typing to create a new tag'
                      }
                      formatCreateLabel={(inputValue) => {
                        return `Create ${formatTagName(inputValue)}`;
                      }}
                      value={value}
                      onChange={onChange}
                      name={name}
                      options={allTags.map((tag) => ({
                        label: formatTagName(tag),
                        value: tag,
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isPending}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </>
  );
}

export function EditTagsDialog({
  children,
  ...rest
}: ComponentProps<typeof Dialog>) {
  const [editingPackage, setEditingPackage] = useAtom(editingPackageAtom);

  return (
    <Dialog
      {...rest}
      open={Boolean(editingPackage)}
      onOpenChange={(open) => {
        if (!open) {
          setEditingPackage(null);
        }
      }}
    >
      {children}
    </Dialog>
  );
}
