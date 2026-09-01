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
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 font-medium text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-50"
    >
      <LinkIcon id={id} className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </a>
  );
}
