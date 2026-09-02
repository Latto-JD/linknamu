import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { links } from "@/data/profile";

type LinkClick = {
  _id: string;
  count: number;
};

const COLLECTION = "linkClicks";
const VALID_IDS = new Set(links.map((link) => link.id));

// 페이지 로드 시 모든 링크의 현재 클릭 수를 한 번에 반환한다.
export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection<LinkClick>(COLLECTION).find().toArray();

    const counts: Record<string, number> = {};
    for (const link of links) counts[link.id] = 0;
    for (const doc of docs) counts[doc._id] = doc.count;

    return NextResponse.json({ counts });
  } catch (error) {
    console.error("클릭 수 조회 실패:", error);
    return NextResponse.json({ error: "클릭 수를 불러오지 못했습니다." }, { status: 500 });
  }
}

// 카드 클릭 시 해당 링크의 클릭 수를 1 증가시키고 갱신된 값을 반환한다.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  const id = body?.id;

  if (typeof id !== "string" || !VALID_IDS.has(id)) {
    return NextResponse.json({ error: "알 수 없는 링크입니다." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const updated = await db
      .collection<LinkClick>(COLLECTION)
      .findOneAndUpdate(
        { _id: id },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" }
      );

    return NextResponse.json({ id, count: updated?.count ?? 1 });
  } catch (error) {
    console.error("클릭 수 증가 실패:", error);
    return NextResponse.json({ error: "클릭 수를 기록하지 못했습니다." }, { status: 500 });
  }
}
