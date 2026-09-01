export type LinkItem = {
  id: string;
  label: string;
  url: string;
};

export const profile = {
  name: "김클로",
  bio: "세계 최강 바이브코더",
  avatarUrl: undefined as string | undefined,
};

export const links: LinkItem[] = [
  { id: "github", label: "GitHub", url: "https://github.com" },
  { id: "blog", label: "Blog", url: "https://example.com/blog" },
  { id: "instagram", label: "Instagram", url: "https://instagram.com" },
  { id: "youtube", label: "YouTube", url: "https://youtube.com" },
];
