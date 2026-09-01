import Image from "next/image";

type ProfileHeaderProps = {
  name: string;
  bio: string;
  avatarUrl?: string;
};

export default function ProfileHeader({ name, bio, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-4xl font-semibold text-white">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>{name.charAt(0)}</span>
        )}
      </div>
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{name}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{bio}</p>
    </div>
  );
}
