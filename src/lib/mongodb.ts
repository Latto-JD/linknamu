import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("환경 변수 MONGODB_URI가 설정되지 않았습니다. .env.local을 확인하세요.");
}

const DB_NAME = "linknamu";

// 개발 모드에서 HMR로 모듈이 다시 평가돼도 커넥션이 중복 생성되지 않도록 전역에 캐싱한다.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}
