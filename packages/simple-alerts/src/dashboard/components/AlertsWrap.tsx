import React from "react"
import Select, { GroupBase, Options } from "react-select"
import { Alerts } from "twitch/global"
import { useReplicant } from "use-nodecg"

interface SelectProps<> {}

type Props = { selectedAlert: Alerts.Alert | null; i: number; setAlert: (alert: Alerts.Alert, i: number) => void }

export default function AlertsWrap({ selectedAlert, setAlert, i }: Props) {
  const [media] = useReplicant<Alerts.Asset[]>("assets:media-graphics", [])
  if (selectedAlert === null) return <div id="alerts-wrap"></div>
  else
    return (
      <div id="alerts-wrap" className="flex flex-col items-center w-full">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={selectedAlert.name}
            onChange={(e) => setAlert({ ...selectedAlert, name: e.target.value }, i)}
          />
        </div>
        <div>
          <label htmlFor="duration">Duration:</label>
          <input
            id="duration"
            type="number"
            step={1}
            value={selectedAlert.duration}
            onChange={(e) => setAlert({ ...selectedAlert, duration: parseInt(e.target.value) }, i)}
          />
        </div>
        <div className="text-gray-800 w-1/2">
          <Select
            isMulti
            defaultValue={selectedAlert.media}
            className="text-gray-800 w-full"
            // @ts-ignore
            onChange={(val: { value: number; label: string }[], action) => {
              setAlert({ ...selectedAlert, media: val.map((v) => v.value) }, i)
            }}
            // @ts-ignore
            options={media.map((val, i) => ({ value: i, label: val.base }))}
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
  "Arial, sans-serif",
  "'Times New Roman', serif",
  "'Courier New', monospace",
  "'Brush Script MT', cursive",
  "Palanquin",
  "'Aclonica'",
  "'Aladin'",
  "'Amita'",
  "''Audiowide'",
  "'Balsamiq Sans'",
  "'Bebas Neue'",
  "'Fontdiner Swanky'",
  "'Lilita One'",
]
