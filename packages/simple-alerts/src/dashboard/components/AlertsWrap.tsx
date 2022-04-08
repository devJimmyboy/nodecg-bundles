import React from "react";
import Select from "react-select";
import { Alerts } from "twitch/global";
import { useReplicant } from "use-nodecg";

interface SelectProps<Option = { value: number; label: string }, isMulti = true> {}

type Props = { selectedAlert: Alerts.Alert | null; i: number; setAlert: (alert: Alerts.Alert, i: number) => void }

export default function AlertsWrap({ selectedAlert, setAlert, i }: Props) {
  const [media] = useReplicant<Alerts.Asset[], Alerts.Asset[]>('assets:media-graphics', [])
  if (!selectedAlert) return <div id="alerts-wrap"></div>
  else
    return (
      <div id="alerts-wrap" className="flex flex-col items-center w-full gap-6">
        <div>
          <label htmlFor="name" className="mb-2 text-white">
            Name:
          </label>
          <input
            id="name"
            className="input input-bordered text-base-content font-semibold"
            type="text"
            value={selectedAlert.name}
            onChange={(e) => setAlert({ ...selectedAlert, name: e.target.value }, i)}
          />
        </div>
        <div>
          <label htmlFor="duration" className="mb-2 text-white">
            Duration:
          </label>
          <input
            id="duration"
            className="input input-bordered text-base-content font-semibold"
            type="number"
            step={1}
            value={selectedAlert.duration}
            onChange={(e) => setAlert({ ...selectedAlert, duration: parseInt(e.target.value) }, i)}
          />
        </div>
        <div className="text-gray-800 w-1/2">
          <label htmlFor="media" className="mb-2 text-white">
            Videos/Memes:
          </label>
          <Select<{ value: number; label: string }, true>
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value.toString()}
            isMulti
            id="media"
            value={selectedAlert.media.map((m) => media[m] && { value: m, label: media[m].base })}
            className="text-gray-800 w-full"
            // @ts-ignore
            onChange={(val, action) => {
              setAlert({ ...selectedAlert, media: val.map((v) => v.value) }, i)
            }}
            // @ts-ignore
            options={media.map((val, ind) => ({ value: ind, label: val.base }))}
          />
        </div>
      </div>
    )
}
//?        Example Alert
// {
//         name: "Default Alert",
//!         message: "",
//         duration: 5000,
//         media: [],
//         sound: "none",
//         layout: "banner",
//         volume: 80,
//         keywordColour: "#4FE639",
//         fontColour: "#FFFFFF",
//         customCSS: "",
//         font: '"Palanquin"',
//         fontWeight: "800",
//         fontSize: "64",
//       }
var fonts = [
  'Arial, sans-serif',
  "'Times New Roman', serif",
  "'Courier New', monospace",
  "'Brush Script MT', cursive",
  'Palanquin',
  "'Aclonica'",
  "'Aladin'",
  "'Amita'",
  "''Audiowide'",
  "'Balsamiq Sans'",
  "'Bebas Neue'",
  "'Fontdiner Swanky'",
  "'Lilita One'",
]
