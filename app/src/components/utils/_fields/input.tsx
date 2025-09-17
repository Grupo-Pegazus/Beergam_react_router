interface InputProps {
  placeholder?: string;
  required?: boolean;
  value: string | number;
  type?: string;
  error?: boolean;
  onChange?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  disabled?: boolean | undefined;
}

export default function Input({
  error,
  placeholder,
  required,
  value,
  type,
  onChange,
  onBlur,
  name,
  style,
  onFocus,
  min,
  max,
  disabled,
}: InputProps) {
  const isValid = required && value && !error;

  const baseClasses =
    "w-full px-3 py-2.5 border border-black/20 rounded text-sm bg-white text-[#1e1f21] transition-colors duration-200 outline-none";
  const errorClasses = error ? "border-red-500" : "";
  const successClasses = isValid ? "border-green-500" : "";
  const focusClasses = "focus:border-[#ff8a00]";
  const disabledClasses = disabled
    ? "bg-gray-50 cursor-not-allowed border-gray-300 text-slate-500"
    : "";

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      required={required}
      className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses}`}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      name={name}
      style={style}
      min={min}
      max={max}
      disabled={disabled}
    />
  );
}
