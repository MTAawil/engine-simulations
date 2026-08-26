import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("opens the Meiosis prototype from the simulation switcher", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Meiosis" }));

    expect(
      screen.getByRole("heading", { name: /meiosis prototype/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Meiosis readings" }),
    ).toBeInTheDocument();
  });
});
