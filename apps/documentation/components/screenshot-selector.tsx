import Image from 'next/image';

export function MockWindow({ children }) {
  return (
    <div className="border rounded-t-md shadow inset-shadow">
      <div className="bg-muted flex items-center rounded-t-md p-2 gap-1 border-b relative">
        <div className="h-2 w-2 rounded-full bg-success" />
        <div className="h-2 w-2 rounded-full bg-warning" />
        <div className="h-2 w-2 rounded-full bg-destructive" />
      </div>
      <div className="aspect-[15/10] max-w-[800px] w-full relative block">
        {children}
      </div>
    </div>
  );
}

export function ScreenshotSelector() {
  return (
    <div className="w-full mx-auto">
      <div className="relative mx-auto block">
        <MockWindow key="commonality">
          <Image
            src="/commonality-light.png"
            width={1200}
            height={800}
            className="dark:hidden"
          />
          <Image
            src="/commonality-dark.png"
            width={1200}
            height={800}
            className="hidden dark:block"
          />
        </MockWindow>
      </div>
    </div>
  );
}
