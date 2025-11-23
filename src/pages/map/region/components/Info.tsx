export function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}
