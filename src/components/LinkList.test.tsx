import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LinkList from "@/components/LinkList";
import type { LinkItem } from "@/data/profile";

const links: LinkItem[] = [
  { id: "github", label: "GitHub", url: "https://github.com/x" },
  { id: "blog", label: "Blog", url: "https://blog.example.com" },
];

const fetchMock = vi.fn();

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: async () => body } as Response;
}

// GET(초기 조회)은 initialCounts로 응답하고, POST는 postImpl로 처리한다.
function setupFetch(
  initialCounts: Record<string, number> | null = {},
  postImpl: () => Promise<Response> = async () => jsonResponse({})
) {
  fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
    if (init?.method === "POST") return postImpl();
    return initialCounts
      ? Promise.resolve(jsonResponse({ counts: initialCounts }))
      : Promise.reject(new Error("network"));
  });
}

const postCalls = () =>
  fetchMock.mock.calls.filter(([, init]) => (init as RequestInit | undefined)?.method === "POST");

const card = (label: string) => screen.getByRole("link", { name: new RegExp(`^${label}`) });

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe("LinkList 클릭 처리", () => {
  it("클릭하면 POST /api/clicks를 id가 담긴 JSON body로 호출한다", async () => {
    setupFetch();
    render(<LinkList links={links} />);

    await userEvent.click(card("GitHub"));

    const calls = postCalls();
    expect(calls).toHaveLength(1);
    const [url, init] = calls[0] as [string, RequestInit];
    expect(url).toBe("/api/clicks");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body as string)).toEqual({ id: "github" });
    expect(init.keepalive).toBe(true);
  });

  it("클릭하면 응답을 기다리지 않고 카운트가 즉시 1 증가한다", async () => {
    setupFetch({ github: 0, blog: 0 }, () => new Promise(() => {})); // 끝나지 않는 POST
    render(<LinkList links={links} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/clicks"));
    expect(card("GitHub")).toHaveTextContent("0회");
    await userEvent.click(card("GitHub"));

    expect(card("GitHub")).toHaveTextContent("1회");
  });

  it("서버에서 받은 기존 카운트에 이어서 증가한다", async () => {
    setupFetch({ github: 5, blog: 2 });
    render(<LinkList links={links} />);

    await waitFor(() => expect(card("GitHub")).toHaveTextContent("5회"));
    await userEvent.click(card("GitHub"));

    expect(card("GitHub")).toHaveTextContent("6회");
  });

  it("여러 번 클릭하면 클릭한 횟수만큼 누적된다", async () => {
    setupFetch();
    render(<LinkList links={links} />);

    await userEvent.click(card("GitHub"));
    await userEvent.click(card("GitHub"));
    await userEvent.click(card("GitHub"));

    expect(card("GitHub")).toHaveTextContent("3회");
    expect(postCalls()).toHaveLength(3);
  });

  it("여러 카드 중 클릭한 카드의 카운트만 증가한다", async () => {
    setupFetch({ github: 1, blog: 4 });
    render(<LinkList links={links} />);
    await waitFor(() => expect(card("Blog")).toHaveTextContent("4회"));

    await userEvent.click(card("Blog"));

    expect(card("Blog")).toHaveTextContent("5회");
    expect(card("GitHub")).toHaveTextContent("1회");
    expect(JSON.parse((postCalls()[0][1] as RequestInit).body as string)).toEqual({ id: "blog" });
  });

  it("POST fetch가 reject되어도 unhandled rejection 없이 낙관적 카운트가 유지된다", async () => {
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);
    try {
      setupFetch({}, () => Promise.reject(new Error("network down")));
      render(<LinkList links={links} />);

      await userEvent.click(card("GitHub"));
      // 이벤트 루프를 한 바퀴 돌려 unhandledRejection이 발생할 시간을 준다.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(unhandled).not.toHaveBeenCalled();
      expect(card("GitHub")).toHaveTextContent("1회");
    } finally {
      process.off("unhandledRejection", unhandled);
    }
  });

  // 의도된 동작: 새 탭 이동은 그대로 진행되므로 기록 실패 시에도 UI 숫자는 되돌리지 않는다.
  it("POST가 500을 반환해도 카운트는 되돌리지 않는다 (현재 동작 고정)", async () => {
    setupFetch({}, async () => jsonResponse({ error: "x" }, false));
    render(<LinkList links={links} />);

    await userEvent.click(card("GitHub"));

    expect(card("GitHub")).toHaveTextContent("1회");
  });

  it("초기 카운트 조회가 실패하면 모든 카드가 0회로 표시된다", async () => {
    setupFetch(null);
    render(<LinkList links={links} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/clicks"));
    expect(card("GitHub")).toHaveTextContent("0회");
    expect(card("Blog")).toHaveTextContent("0회");
  });

  it("초기 카운트 조회 실패 후에도 클릭 기록은 동작한다", async () => {
    setupFetch(null);
    render(<LinkList links={links} />);

    await userEvent.click(card("Blog"));

    expect(card("Blog")).toHaveTextContent("1회");
    expect(postCalls()).toHaveLength(1);
  });

  it("초기 조회 응답이 ok:false이면 0회를 유지한다", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({ counts: { github: 9 } }, false)));
    render(<LinkList links={links} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/clicks"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(card("GitHub")).toHaveTextContent("0회");
  });

  it("초기 조회 응답에 counts가 없으면 0회를 유지한다", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})));
    render(<LinkList links={links} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/clicks"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(card("GitHub")).toHaveTextContent("0회");
  });

  it("조회 응답이 클릭보다 늦게 도착해도 방금 한 클릭이 사라지지 않는다", async () => {
    let resolveGet!: (res: Response) => void;
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === "POST"
        ? Promise.resolve(jsonResponse({}))
        : new Promise<Response>((resolve) => {
            resolveGet = resolve;
          })
    );
    render(<LinkList links={links} />);

    await userEvent.click(card("GitHub"));
    expect(card("GitHub")).toHaveTextContent("1회");

    resolveGet(jsonResponse({ counts: { github: 5, blog: 2 } }));

    await waitFor(() => expect(card("Blog")).toHaveTextContent("2회"));
    expect(card("GitHub")).toHaveTextContent("6회");
  });

  it("언마운트된 뒤 도착한 조회 응답은 무시한다", async () => {
    let resolveGet!: (res: Response) => void;
    fetchMock.mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveGet = resolve;
        })
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<LinkList links={links} />);

    unmount();
    resolveGet(jsonResponse({ counts: { github: 5 } }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("링크가 없으면 카드를 렌더링하지 않는다", () => {
    setupFetch();
    render(<LinkList links={[]} />);

    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
