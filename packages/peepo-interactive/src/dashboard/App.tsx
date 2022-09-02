import { RangeSlider, Slider } from "@mantine/core";
import React from "react";
import { useReplicant } from "use-nodecg";

type Props = {};

interface PeepoOptions {
  peepoSize: number;
  filters: string[];
  tts: boolean;
  position: { x: number; y: number };
}

export default function App({}: Props) {
  const [options, setOptions] = useReplicant<PeepoOptions, PeepoOptions>(
    "options",
    {
      peepoSize: 1.0,
      filters: [],
      tts: true,
      position: { x: 1840, y: 1000 },
    },
    {
      defaultValue: {
        peepoSize: 1.0,
        filters: [],
        tts: true,
        position: { x: 1840, y: 1000 },
      },
      persistent: true,
    }
  );
  return (
    <form
      className="p-5 flex flex-col gap-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <button
        className="w-full btn btn-error"
        onClick={() => nodecg.sendMessage("stopPls")}
      >
        Stop Peeper Talk
      </button>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Make the Peepo say...</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="peepoTalkInput"
            className="w-full pr-16 input input-primary input-bordered"
            placeholder="Type something..."
          />
          <button
            id="peepoTalkButton"
            className="absolute right-0 top-0 rounded-1-none btn btn-primary"
          >
            Talk
          </button>
        </div>
      </div>
      <div className="flex flex-col form-control">
        <label htmlFor="peepoSize">Scale of Peepo</label>
        <input
          type="range"
          id="peepoSize"
          name="peepoSize"
          min="0.01"
          max="1.0"
          step="0.01"
          value="1.0"
          className="range range-primary"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Enable TTS?</span>
          <input
            type="checkbox"
            id="ttsCheckbox"
            checked
            className="checkbox"
          />
        </label>
      </div>
      <div className="flex flex-row w-full items-center">
        <span className="text-lg">Position:</span>
        <div className="flex-grow"></div>
        <button
          className="btn btn-secondary"
          onClick={(event) => {
            event.preventDefault();
            window.location.reload();
            nodecg.sendMessage("peepoPosReset");
          }}
        >
          Reset
        </button>
      </div>
      <div className="form-control">
        <div className="flex flex-row gap-4">
          <Slider
            id="peepoPosX"
            name="peepoPosX"
            className="w-full"
            min={0}
            max={1920}
            step={1}
            value={options.position.x}
            onChange={(e) => {
              setOptions({
                ...options,
                position: { x: e, y: options.position.y },
              });
            }}
          />
          <input
            type="number"
            id="peepoPosYVal"
            className="input input-bordered input-md"
          />
        </div>
        <label className="label-text" htmlFor="peepoPosY">
          Y-Position
        </label>
        <div className="flex flex-row gap-4">
          <input
            type="range"
            id="peepoPosY"
            name="peepoPosY"
            min="0"
            max="1080"
            step="1"
            value="1040"
            onInput={(e) =>
              ((e.currentTarget.nextElementSibling as HTMLInputElement).value =
                e.currentTarget.value)
            }
            className="range range-accent"
          />
          <input
            type="number"
            id="peepoPosYVal"
            className="input input-bordered input-md"
          />
        </div>
      </div>
    </form>
  );
}
