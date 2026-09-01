import LinkIcon from "@/components/LinkIcon";

type LinkCardProps = {
  id: string;
  label: string;
  url: string;
};

export default function LinkCard({ id, label, url }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-5 py-4 font-medium text-zinc-800 shadow-[0_6px_24px_-12px_rgba(120,72,40,0.35)] backdrop-blur-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_12px_30px_-14px_rgba(120,72,40,0.45)] active:translate-y-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-100 dark:hover:bg-white/[0.1]"
    >
      <LinkIcon
        id={id}
        className="h-5 w-5 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200"
      />
      <span>{label}</span>
    </a>
  );
}
