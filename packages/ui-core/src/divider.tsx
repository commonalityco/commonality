export function Divider({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M16 1L8 23" className="stroke-border" strokeLinecap="round" />
    </svg>
  );
}

export default Divider;
