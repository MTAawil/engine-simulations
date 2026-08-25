import type { SimulationLifecycleState } from "../../core/simulation";

export type PlaybackControlsProps = {
  lifecycleState: SimulationLifecycleState;
  canStep?: boolean;
  speedMultiplier: number;
  speedOptions?: readonly number[];
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep?: () => void;
  onSpeedChange: (speedMultiplier: number) => void;
};

const defaultSpeedOptions = [0.25, 0.5, 1, 1.5, 2] as const;

export function PlaybackControls({
  lifecycleState,
  canStep = true,
  speedMultiplier,
  speedOptions = defaultSpeedOptions,
  onPlay,
  onPause,
  onReset,
  onStep,
  onSpeedChange,
}: PlaybackControlsProps) {
  const isPlaying = lifecycleState === "playing";
  const isDisabled =
    lifecycleState === "idle" ||
    lifecycleState === "initializing" ||
    lifecycleState === "error" ||
    lifecycleState === "destroyed";
  const stepIsDisabled = isDisabled || !canStep || isPlaying || !onStep;

  return (
    <div className="playback-controls" aria-label="Simulation playback controls">
      <button type="button" onClick={onPlay} disabled={isDisabled || isPlaying}>
        Play
      </button>
      <button type="button" onClick={onPause} disabled={isDisabled || !isPlaying}>
        Pause
      </button>
      <button type="button" onClick={onReset} disabled={isDisabled}>
        Reset
      </button>
      <button type="button" onClick={onStep} disabled={stepIsDisabled}>
        Step
      </button>
      <label>
        <span>Speed</span>
        <select
          value={String(speedMultiplier)}
          disabled={isDisabled}
          onChange={(event) => {
            onSpeedChange(Number(event.target.value));
          }}
        >
          {speedOptions.map((option) => (
            <option key={option} value={String(option)}>
              {option}x
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
