interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => React.ReactNode;
}

const CONTROL = "mt-2 min-h-12 w-full rounded-md border bg-white px-3 py-2 text-base text-ink";

export function Field({ id, label, hint, error, optional, children }: FieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        className: `${CONTROL} ${error ? "border-alert" : "border-line"}`,
      })}
      {error && (
        <p id={`${id}-error`} className="mt-2 font-medium text-alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface ChoiceProps<T extends string> {
  name: string;
  legend: string;
  options: { value: T; label: string; hint?: string }[];
  value: T | undefined;
  error?: string;
  onChange: (value: T) => void;
}

export function Choice<T extends string>({ name, legend, options, value, error, onChange }: ChoiceProps<T>) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="font-medium">{legend}</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-md border-2 bg-white p-4 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-sky ${
              value === o.value ? "border-leaf" : "border-line"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="mt-1 size-5 accent-leaf"
            />
            <span>
              <span className="block font-semibold">{o.label}</span>
              {o.hint && <span className="block text-sm text-muted">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 font-medium text-alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
