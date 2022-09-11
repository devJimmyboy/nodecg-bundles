import { debounce } from "lodash";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Group,
  NumberInput,
  RangeSlider,
  Slider,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
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
  const [talk, setTalk] = React.useState("");

  const changeScale = React.useCallback(
    debounce(function (e) {
      if (typeof e === "number") {
        e = { target: { value: e } };
      }
      setOptions({ ...options, peepoSize: e.target.value });
      console.debug("Peepo Size Changed to ", e.target.value);
    }, 150),
    [options]
  );
  const changePos = React.useCallback(
    (type: "x" | "y", e: number) => {
      setOptions({
        ...options,
        position: {
          ...options.position,
          [type]: e,
        },
      });

      // console.debug("Peepo Position Changed to ", options.position);
    },
    [options]
  );
  return (
    <Stack
      sx={{ width: "100%" }}
      p={16}
      spacing="md"
      align="stretch"
      justify="center"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <Button
        fullWidth
        variant="filled"
        onClick={() => nodecg.sendMessage("stopPls")}
      >
        Stop Peeper Talk
      </Button>
      <Group align="end">
        <TextInput
          label="Make the Peepo say..."
          id="peepoTalkInput"
          className="flex-grow mx-16"
          placeholder="Type something..."
          value={talk}
          sx={{ minWidth: 300, width: "33%" }}
          onChange={(e) => setTalk(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            nodecg.sendMessage("peepoTalkOnDemand", talk);
          }}
        />
        <Button
          variant="filled"
          id="peepoTalkButton"
          onClick={(e) => {
            nodecg.sendMessage("peepoTalkOnDemand", talk);
          }}
        >
          Talk
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Checkbox
          label="Enable TTS?"
          id="ttsCheckbox"
          name="ttsCheckbox"
          checked={options.tts}
          onChange={(e) => {
            setOptions({ ...options, tts: e.target.checked });
          }}
          sx={{
            alignSelf: "center",
            fontWeight: "bold",
          }}
        />
      </Group>

      <Group align="center" position="center" grow>
        <Slider
          sx={{ width: "100%" }}
          label="Scale of Peepo"
          labelAlwaysOn
          id="peepoSize"
          name="peepoSize"
          color="green"
          min={0.01}
          max={1.0}
          step={0.01}
          value={options.peepoSize}
          className="w-full"
          onChange={changeScale}
          mt={12}
        />
      </Group>

      <Card
        component={Stack}
        sx={{ width: "100%", maxWidth: 600, alignSelf: "center" }}
        align="stretch"
        spacing="lg"
      >
        <Group align="center" position="apart">
          <span className="text-lg">Position:</span>
          <Button
            onClick={(event) => {
              event.preventDefault();
              window.location.reload();
              nodecg.sendMessage("peepoPosReset");
            }}
          >
            Reset
          </Button>
        </Group>

        <Group spacing={6}>
          <Text component="label" htmlFor="peepoPosX">
            X Position:
          </Text>
          <Slider
            id="peepoPosX"
            name="peepoPosX"
            size="md"
            sx={{ flexGrow: 1 }}
            min={0}
            max={1920}
            step={1}
            value={options.position.x}
            onChange={(e) => changePos("x", e)}
          />
          <NumberInput
            id="peepoPosXVal"
            value={options.position?.x}
            onChange={(e) => {
              setOptions({
                ...options,
                position: {
                  ...options.position,
                  x: e,
                },
              });
            }}
          />
        </Group>

        <Group spacing={6}>
          <Text component="label" htmlFor="peepoPosY">
            Y Position:
          </Text>
          <Slider
            id="peepoPosY"
            name="peepoPosY"
            size="md"
            sx={{ flexGrow: 1 }}
            min={0}
            max={1080}
            step={1}
            value={options.position.y}
            onChange={(e) => changePos("y", e)}
          />
          <NumberInput
            id="peepoPosYVal"
            value={options.position?.y}
            onChange={(e) => {
              setOptions({
                ...options,
                position: {
                  ...options.position,
                  y: e,
                },
              });
            }}
          />
        </Group>
      </Card>
    </Stack>
  );
}
