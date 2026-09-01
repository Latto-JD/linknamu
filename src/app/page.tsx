import ProfileHeader from "@/components/ProfileHeader";
import LinkList from "@/components/LinkList";
import DarkModeToggle from "@/components/DarkModeToggle";
import { profile, links } from "@/data/profile";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-100 px-4 py-12 dark:bg-zinc-950 sm:py-20">
      <DarkModeToggle />
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl bg-white/80 p-6 shadow-sm dark:bg-zinc-900/60 sm:p-8">
        <ProfileHeader name={profile.name} bio={profile.bio} avatarUrl={profile.avatarUrl} />
        <LinkList links={links} />
      </div>
    </div>
  );
}
