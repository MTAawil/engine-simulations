import { useId, type ReactNode } from "react";
import "./presentation.css";

export type PresentationShellProps = {
  title: string;
  subtitle?: string;
  isPresentationMode: boolean;
  stage: ReactNode;
  controls?: ReactNode;
  supportingPanel?: ReactNode;
  showSupportingPanelInPresentation?: boolean;
};

export function PresentationShell({
  title,
  subtitle,
  isPresentationMode,
  stage,
  controls,
  supportingPanel,
  showSupportingPanelInPresentation = false,
}: PresentationShellProps) {
  const titleId = useId();
  const shouldShowSupportingPanel =
    supportingPanel && (!isPresentationMode || showSupportingPanelInPresentation);

  return (
    <section
      className={`presentation-shell${
        isPresentationMode ? " presentation-shell--presenting" : ""
      }`}
      aria-labelledby={titleId}
    >
      <header className="presentation-shell__header">
        <div>
          <p className="presentation-shell__eyebrow">
            {isPresentationMode ? "Presentation" : "Simulation"}
          </p>
          <h2 id={titleId}>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </header>

      <div className="presentation-shell__workspace">
        <div className="presentation-shell__stage-column">
          <div
            className="presentation-shell__stage"
            role="region"
            aria-label={`${title} stage`}
          >
            {stage}
          </div>
          {controls ? (
            <div className="presentation-shell__controls">{controls}</div>
          ) : null}
        </div>

        {shouldShowSupportingPanel ? (
          <aside className="presentation-shell__supporting-panel">
            {supportingPanel}
          </aside>
        ) : null}
      </div>
    </section>
  );
}
