import { Textarea } from "@/components/ui/textarea";

type TextareaItemProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextareaItem({ label, value, onChange }: TextareaItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Textarea
        className="min-h-[80px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
