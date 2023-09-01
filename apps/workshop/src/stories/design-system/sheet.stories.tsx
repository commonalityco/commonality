import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  Button,
  Input,
  Label,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ScrollArea,
} from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  args: {
    open: true,
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    children: (
      <>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </>
    ),
  },
};

export const StressTest: Story = {
  args: {
    children: (
      <>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>
              This is a
              looooooooooooooooooooooooooonnnnnnnnnnnnnnngggggggggggggg title
            </SheetTitle>
            <SheetDescription>
              This is some
              loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong
              content, like
              realllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllly
              long.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Mauris
              sit amet massa vitae tortor condimentum lacinia quis vel. In
              egestas erat imperdiet sed euismod nisi porta lorem mollis.
              Lacinia quis vel eros donec ac odio tempor. Diam vel quam
              elementum pulvinar etiam non quam. Nisi quis eleifend quam
              adipiscing vitae proin. Rutrum quisque non tellus orci ac auctor
              augue mauris. Nulla porttitor massa id neque aliquam vestibulum
              morbi blandit. Mauris cursus mattis molestie a. Quam nulla
              porttitor massa id neque aliquam vestibulum. Ultrices gravida
              dictum fusce ut placerat orci nulla. Fermentum posuere urna nec
              tincidunt praesent semper feugiat. Sit amet porttitor eget dolor
              morbi non arcu risus. Leo integer malesuada nunc vel risus
              commodo. Eget magna fermentum iaculis eu non diam. Est ante in
              nibh mauris cursus mattis. Scelerisque mauris pellentesque
              pulvinar pellentesque habitant morbi. Ligula ullamcorper malesuada
              proin libero nunc consequat interdum. Magna fringilla urna
              porttitor rhoncus dolor purus. Sodales ut eu sem integer vitae
              justo. Ut ornare lectus sit amet est placerat. Velit euismod in
              pellentesque massa placerat duis ultricies lacus sed. Mauris
              ultrices eros in cursus turpis massa tincidunt dui. Pulvinar neque
              laoreet suspendisse interdum consectetur libero id faucibus. Velit
              aliquet sagittis id consectetur purus ut faucibus pulvinar
              elementum. Non sodales neque sodales ut etiam sit amet nisl purus.
              Molestie nunc non blandit massa enim nec. Mattis enim ut tellus
              elementum sagittis vitae. Laoreet sit amet cursus sit amet dictum
              sit amet justo. Donec adipiscing tristique risus nec feugiat in.
              Commodo ullamcorper a lacus vestibulum sed arcu non. Lectus sit
              amet est placerat in egestas. Iaculis eu non diam phasellus
              vestibulum lorem sed risus ultricies. Nam aliquam sem et tortor
              consequat id. Diam sollicitudin tempor id eu nisl nunc mi. Cursus
              euismod quis viverra nibh cras pulvinar mattis nunc sed. At
              volutpat diam ut venenatis. Orci eu lobortis elementum nibh.
              Laoreet suspendisse interdum consectetur libero id faucibus nisl.
              Nulla pharetra diam sit amet nisl. Mauris pellentesque pulvinar
              pellentesque habitant. Adipiscing enim eu turpis egestas pretium
              aenean. Diam ut venenatis tellus in metus vulputate eu. Lacinia at
              quis risus sed vulputate odio ut. Vulputate dignissim suspendisse
              in est. Suspendisse sed nisi lacus sed viverra tellus in hac.
              Sodales ut etiam sit amet. Diam quam nulla porttitor massa id
              neque aliquam vestibulum. Etiam non quam lacus suspendisse
              faucibus. Mattis rhoncus urna neque viverra justo nec ultrices dui
              sapien. In hendrerit gravida rutrum quisque non tellus orci.
              Rutrum quisque non tellus orci ac auctor augue mauris. At ultrices
              mi tempus imperdiet nulla malesuada pellentesque. Nullam non nisi
              est sit amet. Non curabitur gravida arcu ac tortor dignissim. Nisi
              est sit amet facilisis magna etiam tempor. Feugiat in ante metus
              dictum at tempor commodo ullamcorper. Ornare quam viverra orci
              sagittis eu volutpat odio. Viverra aliquet eget sit amet tellus
              cras adipiscing. Orci ac auctor augue mauris augue neque gravida
              in. Sociis natoque penatibus et magnis dis parturient montes. Sit
              amet mauris commodo quis imperdiet. Augue eget arcu dictum varius
              duis at consectetur lorem donec. Tortor at auctor urna nunc id.
              Egestas pretium aenean pharetra magna ac placerat. At varius vel
              pharetra vel turpis nunc eget. Nunc id cursus metus aliquam
              eleifend mi in. Nisi est sit amet facilisis magna etiam tempor
              orci eu. Purus faucibus ornare suspendisse sed nisi lacus sed
              viverra. Sagittis orci a scelerisque purus semper eget duis at.
              Sagittis eu volutpat odio facilisis.
            </p>
          </ScrollArea>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </>
    ),
  },
};
