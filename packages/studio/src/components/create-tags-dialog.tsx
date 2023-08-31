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
  FormLabel,
  FormControl,
  Input,
  FormDescription,
  FormMessage,
  Form,
} from '@commonalityco/ui-design-system';
import { formatTagName } from '@commonalityco/utils-core';
import React, { ComponentProps, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { setTagsAction } from 'actions/metadata';

const formSchema = z.object({
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
});

export function CreateTagsDialogContent({
  packageName,
  tags,
  existingTags,
}: {
  packageName: string;
  tags: string[];
  existingTags: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: existingTags.map((existingTag) => ({
        value: existingTag,
        label: formatTagName(existingTag),
      })),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTags = values.tags.map((item) => item.value);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      await setTagsAction({ packageName, tags: newTags });
    });
  }

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit tags</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tags"
              render={({ field: { onChange, value, name, ref } }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <CreatebleSelect
                      isMulti
                      placeholder="Search for tags..."
                      noOptionsMessage={() =>
                        'Start typing to create a new tag'
                      }
                      closeMenuOnSelect={false}
                      formatCreateLabel={(inputValue) => {
                        return `Create ${formatTagName(inputValue)}`;
                      }}
                      value={value}
                      onChange={onChange}
                      name={name}
                      options={tags.map((tag) => ({
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

export function CreateTagsDialog({
  children,
  ...rest
}: ComponentProps<typeof Dialog>) {
  return <Dialog {...rest}>{children}</Dialog>;
}
