import {
  SimpleGrid,
  Select,
  MultiSelect,
  TextInput,
  Grid,
  NumberInput,
  ColorInput,
  Text,
  Autocomplete,
} from "@mantine/core";
import { debounce } from "lodash";
import React, { useEffect } from "react";
import { Alerts } from "twitch/global";
import { useReplicant } from "use-nodecg";

interface SelectProps<
  Option = { value: number; label: string },
  isMulti = true
> {}

type Props = {
  selectedAlert: Alerts.Alert | null;
  i: number;
  setAlert: (alert: Alerts.Alert, i: number) => void;
};

export default function AlertsWrap({ selectedAlert, setAlert, i }: Props) {
  const [media] = useReplicant<Alerts.Asset[], Alerts.Asset[]>(
    "assets:media-graphics",
    []
  );
  useEffect(() => {
    console.log(selectedAlert);
  }, [selectedAlert]);
  if (!selectedAlert) return <div id="alerts-wrap"></div>;
  else
    return (
      <Grid grow id="alerts-wrap" className="w-full" gutter={6}>
        <Grid.Col span={4}>
          <TextInput
            label="Name"
            id="name"
            className="input input-bordered text-base-content font-semibold"
            type="text"
            value={selectedAlert.name}
            onChange={(e) =>
              setAlert({ ...selectedAlert, name: e.target.value }, i)
            }
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Duration"
            id="duration"
            className="input input-bordered text-base-content font-semibold"
            type="number"
            step={1}
            value={selectedAlert.duration}
            onChange={(e) =>
              setAlert(
                { ...selectedAlert, duration: parseInt(e.target.value) },
                i
              )
            }
          />
        </Grid.Col>
        <Grid.Col span={12} className="text-gray-800 w-1/2">
          <MultiSelect
            label="Videos/Memes:"
            id="media"
            value={selectedAlert.media.map((m) => m.toString())}
            className="text-gray-800 w-full"
            onChange={(val) => {
              setAlert({ ...selectedAlert, media: val.map((v) => +v) }, i);
            }}
            data={media.map((val, ind) => ({
              value: ind.toString(),
              label: val.base,
            }))}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Select
            label="Font"
            id="font-select"
            value={selectedAlert.font}
            onChange={(e) => {
              setAlert({ ...selectedAlert, font: e }, i);
            }}
            data={[
              "Arial",
              "Courier New",
              "Georgia",
              "Helvetica",
              "Times New Roman",
              "Lilita One",
            ]}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <ColorInput
            label="Font Color"
            id="font-color"
            value={selectedAlert.fontColour}
            onChange={debounce((e) => {
              setAlert({ ...selectedAlert, fontColour: e }, i);
            }, 150)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <ColorInput
            label="Highlight Color"
            id="keyword-color"
            value={selectedAlert.keywordColour}
            onChange={debounce((e) => {
              setAlert({ ...selectedAlert, keywordColour: e }, i);
            }, 150)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Font Size"
            id="font-size"
            value={+selectedAlert.fontSize.replace("px", "")}
            onChange={(e) => {
              setAlert({ ...selectedAlert, fontSize: e.toString() }, i);
            }}
            min={1}
            max={100}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Font Weight"
            id="font-weight"
            value={+selectedAlert.fontWeight}
            onChange={(e) => {
              setAlert({ ...selectedAlert, fontWeight: e.toString() }, i);
            }}
            min={100}
            step={100}
            max={900}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Text weight={600} align="center">
            TTS Settings
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Autocomplete label="TTS Voice (Searchable)" data={[]} />
        </Grid.Col>
        <Grid.Col span={6}>lol</Grid.Col>
      </Grid>
    );
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
];
