export type LinkItem = {
  id: string;
  label: string;
  url: string;
};

export const profile = {
  name: "이종덕",
  bio: "풀스택 가발자 | 요즘에는 AI 개발에 관심이 많아요",
  avatarUrl: "/avatar.png" as string | undefined,
};

export const links: LinkItem[] = [
  { id: "github", label: "GitHub", url: "https://github.com/Latto-JD" },
  { id: "blog", label: "Blog", url: "https://blog.naver.com/ljd6009" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/p6009" },
  { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@ljd6009" },
];
