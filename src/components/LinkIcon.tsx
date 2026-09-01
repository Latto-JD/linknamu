import type { IconType } from "react-icons";
import { FaLink, FaRss } from "react-icons/fa6";
import { SiGithub, SiInstagram, SiYoutube } from "react-icons/si";

const ICONS: Record<string, IconType> = {
  github: SiGithub,
  instagram: SiInstagram,
  youtube: SiYoutube,
  blog: FaRss,
};

type LinkIconProps = {
  id: string;
  className?: string;
};

export default function LinkIcon({ id, className }: LinkIconProps) {
  const Icon = ICONS[id] ?? FaLink;
  return <Icon className={className} aria-hidden />;
}
