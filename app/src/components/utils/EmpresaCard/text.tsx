interface TextProps {
  text: string;
}

function Text({ text }: TextProps) {
  return (
    <div>
      <p className={`font-bold text-lg opacity-100`}>{text}</p>
    </div>
  );
}

export default Text;
