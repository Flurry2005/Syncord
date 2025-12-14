interface ChatTextArea {
  value?: string;
  onChange?: (e: any) => void;
  onKeyDown?: string;
  onKeyDownFunc?: () => Promise<void>;
}

function ChatTextArea({
  value,
  onChange,
  onKeyDown,
  onKeyDownFunc,
}: ChatTextArea) {
  return (
    <textarea
      className="self-center border border-(--accent-color) rounded-3xl mb-2 w-9/10 h-1/10 p-3 outline-none focus:border-[#747bff] resize-none"
      value={value}
      onChange={onChange}
      onKeyDown={async (e) => {
        if (e.key === onKeyDown && onKeyDownFunc) {
          e.preventDefault();
          onKeyDownFunc();
        }
      }}
    />
  );
}

export default ChatTextArea;
