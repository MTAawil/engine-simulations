import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the electromagnetic induction prototype workspace", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /electromagnetic induction prototype/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Controls and telemetry/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Live readings" })).toBeInTheDocument();
  });
});
