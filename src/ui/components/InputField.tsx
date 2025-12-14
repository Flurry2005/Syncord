interface InputFieldProps {
  value?: string;
  id?: string;
  type?: string;
  onChange?: (e: any) => void;
  onKeyDown?: string;
  onKeyDownFunc?: () => void;
  additionalClasses?: string;
  placeholder: string;
}

function InputField({
  value,
  id,
  type,
  onChange,
  onKeyDown,
  onKeyDownFunc,
  additionalClasses,
  placeholder,
}: InputFieldProps) {
  return (
    <input
      id={id}
      value={value}
      type={type}
      onChange={onChange}
      onKeyDown={async (e) => {
        if (e.key === onKeyDown && onKeyDownFunc) {
          onKeyDownFunc();
        }
      }}
      placeholder={placeholder}
      className={
        "px-2 border border-(--accent-color) rounded-xl outline-none " +
        additionalClasses
      }
    />
  );
}

export default InputField;
