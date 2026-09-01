import Image from "next/image";

type ProfileHeaderProps = {
  name: string;
  bio: string;
  avatarUrl?: string;
};

export default function ProfileHeader({ name, bio, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative h-28 w-28 rounded-full bg-white/70 p-1 shadow-[0_14px_34px_-12px_rgba(120,72,40,0.5)] ring-1 ring-white/70 dark:bg-white/10 dark:ring-white/15">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={112}
              height={112}
              priority
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-300 to-orange-400 text-3xl font-semibold text-white"
            >
              {name.charAt(0)}
            </span>
          )}
          {/* 살짝의 입체감을 위한 상단 하이라이트 */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent ring-1 ring-inset ring-black/5"
          />
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {name}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{bio}</p>
      </div>
    </div>
  );
}
