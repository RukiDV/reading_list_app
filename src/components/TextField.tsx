import Field, { CONTROL_CLASSES } from "./Field";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function TextField({
  id,
  label,
  value,
  error,
  onChange,
}: TextFieldProps) {
  return (
    <Field id={id} label={label} error={error}>
      <input
        id={id}
        value={value}
        required
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={CONTROL_CLASSES}
      />
    </Field>
  );
}
