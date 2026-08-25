import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the Phase 0 foundation status", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /premium educational simulation engine/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Repository Foundation/i)).toBeInTheDocument();
  });
});
