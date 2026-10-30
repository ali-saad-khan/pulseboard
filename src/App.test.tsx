import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import App from "./App";

beforeAll(() => {
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as never;
});

describe("App", () => {
  it("narrows the table when searching", async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText("Search orders"), "ORD-1000");
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(2); // header + 1
  });
  it("shows an empty state", async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText("Search orders"), "zzzz-nothing");
    expect(screen.getByText(/No orders match/)).toBeInTheDocument();
  });
  it("toggles sort direction via header button", async () => {
    render(<App />);
    const th = screen.getByRole("columnheader", { name: /Amount/ });
    await userEvent.click(within(th).getByRole("button"));
    expect(th).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(within(th).getByRole("button"));
    expect(th).toHaveAttribute("aria-sort", "ascending");
  });
  it("paginates", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/page 2 of/)).toBeInTheDocument();
  });
});
