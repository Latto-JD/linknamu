import LinkCard from "@/components/LinkCard";
import type { LinkItem } from "@/data/profile";

type LinkListProps = {
  links: LinkItem[];
};

export default function LinkList({ links }: LinkListProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {links.map((link) => (
        <LinkCard key={link.id} id={link.id} label={link.label} url={link.url} />
      ))}
    </div>
  );
}
