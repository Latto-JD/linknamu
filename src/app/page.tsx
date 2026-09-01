import ProfileHeader from "@/components/ProfileHeader";
import LinkList from "@/components/LinkList";
import DarkModeToggle from "@/components/DarkModeToggle";
import { profile, links } from "@/data/profile";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-[#FDF6EC] via-[#FBEBDC] to-[#F6D9C2] px-6 py-16 dark:from-[#1b1613] dark:via-[#15110f] dark:to-[#0b0908] sm:px-8 sm:py-24">
      {/* 프로필 뒤 은은한 살구빛 광원 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-500/10"
      />

      <DarkModeToggle />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-10">
        <ProfileHeader name={profile.name} bio={profile.bio} avatarUrl={profile.avatarUrl} />
        <LinkList links={links} />
      </div>
    </main>
  );
}
