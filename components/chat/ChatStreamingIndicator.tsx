export default function ChatStreamingIndicator({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 text-xs text-slate-400">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse [animation-delay:200ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse [animation-delay:400ms]" />
      </div>
      {label && <span className="font-medium">{label}</span>}
    </div>
  );
}
