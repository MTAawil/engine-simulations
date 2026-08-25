import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the electromagnetic induction prototype status", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /electromagnetic induction prototype/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Prototype visual scene/i)).toBeInTheDocument();
  });
});
