"use client";

import { useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import type { LinkItem } from "@/data/profile";

type LinkListProps = {
  links: LinkItem[];
};

export default function LinkList({ links }: LinkListProps) {
  // 데이터를 받기 전에는 모두 0회로 표시된다.
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;

    fetch("/api/clicks")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("요청 실패"))))
      .then((data: { counts?: Record<string, number> }) => {
        const serverCounts = data.counts;
        if (!active || !serverCounts) return;
        // 조회 응답보다 먼저 일어난 클릭(낙관적 증가분)이 덮어써지지 않도록 합산한다.
        setCounts((prev) => {
          const merged = { ...serverCounts };
          for (const [id, n] of Object.entries(prev)) {
            merged[id] = (serverCounts[id] ?? 0) + n;
          }
          return merged;
        });
      })
      .catch(() => {
        // 조회 실패 시 0회 유지
      });

    return () => {
      active = false;
    };
  }, []);

  function handleClick(id: string) {
    // 낙관적 갱신: 응답을 기다리지 않고 먼저 1 올린다.
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true,
    }).catch(() => {
      // 새 탭 이동은 그대로 진행되므로 실패는 조용히 무시
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          id={link.id}
          label={link.label}
          url={link.url}
          count={counts[link.id] ?? 0}
          onClick={() => handleClick(link.id)}
        />
      ))}
    </div>
  );
}
