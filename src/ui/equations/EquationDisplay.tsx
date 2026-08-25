import { useId, type ReactNode } from "react";

export type Equation = {
  id: string;
  label: string;
  expression: string;
  description?: string;
};

export type EquationRenderer = (equation: Equation) => ReactNode;

export type EquationDisplayProps = {
  title?: string;
  equations: readonly Equation[];
  renderEquation?: EquationRenderer;
  emptyMessage?: string;
};

function renderPlainEquation(equation: Equation) {
  return <code>{equation.expression}</code>;
}

export function EquationDisplay({
  title = "Equations",
  equations,
  renderEquation = renderPlainEquation,
  emptyMessage = "No equations available",
}: EquationDisplayProps) {
  const titleId = useId();

  return (
    <section className="equation-display" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      {equations.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul>
          {equations.map((equation) => (
            <li key={equation.id}>
              <article aria-labelledby={`${titleId}-${equation.id}-label`}>
                <h3 id={`${titleId}-${equation.id}-label`}>{equation.label}</h3>
                <div aria-label={`${equation.label} equation`}>
                  {renderEquation(equation)}
                </div>
                {equation.description ? <p>{equation.description}</p> : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
