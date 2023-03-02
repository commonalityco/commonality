export interface StepIndicatorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export function Root({ ...restProps }: StepIndicatorProps) {
  return <div {...restProps} className="flex flex-col" />;
}
