import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LinkCard from "@/components/LinkCard";

afterEach(cleanup);

const renderCard = (onClick = vi.fn(), count = 3) => {
  render(
    <LinkCard id="github" label="GitHub" url="https://github.com/x" count={count} onClick={onClick} />
  );
  return onClick;
};

describe("LinkCard", () => {
  it("클릭하면 onClick이 한 번 호출된다", async () => {
    const onClick = renderCard();
    await userEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("url, 새 탭, 보안 rel 속성이 설정된다", () => {
    renderCard();
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("href", "https://github.com/x");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("라벨과 클릭 수를 표시한다", () => {
    renderCard(vi.fn(), 7);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("7회")).toBeInTheDocument();
  });

  it("클릭 수 0도 '0회'로 표시한다", () => {
    renderCard(vi.fn(), 0);
    expect(screen.getByText("0회")).toBeInTheDocument();
  });
});
