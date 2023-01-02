import { debounce, merge } from "lodash";
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
  const [options, setOptions] = useReplicant<PeepoOptions, null>(
    "options",
    null,
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

  React.useEffect(() => {
    console.debug("Peepo Options Changed to ", options);
  }, [options]);

  const updateScale = React.useCallback(
    (scale: number) => {
      setOptions(merge({}, options, { peepoSize: scale / 100 }));
    },
    [options, setOptions]
  );

  if (!options) return null;
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
        <NumberInput
          sx={{ width: "100%" }}
          id="peepoSize"
          name="peepoSize"
          color="green"
          min={1}
          max={100}
          step={1}
          defaultValue={options.peepoSize}
          className="w-full"
          onChange={updateScale}
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
          {/* <Slider
            id="peepoPosX"
            name="peepoPosX"
            size="md"
            sx={{ flexGrow: 1 }}
            min={0}
            max={1920}
            step={1}
            value={options.position.x}
            onChange={(value) => {
              setOptions({
                ...options,
                position: {
                  x: value,
                  y: options.position.y,
                },
              });
            }}
          /> */}
          <NumberInput
            id="peepoPosXVal"
            value={options.position?.x}
            onChange={(value) => {
              setOptions({
                ...options,
                position: {
                  x: value,
                  y: options.position.y,
                },
              });
            }}
          />
        </Group>

        <Group spacing={6}>
          <Text component="label" htmlFor="peepoPosY">
            Y Position:
          </Text>
          {/* <Slider
            id="peepoPosY"
            name="peepoPosY"
            size="md"
            sx={{ flexGrow: 1 }}
            min={0}
            max={1080}
            step={1}
            value={options.position.y}
            onChange={(value) => {
              setOptions({
                ...options,
                position: {
                  x: options.position.x,
                  y: value,
                },
              });
            }}
          /> */}
          <NumberInput
            id="peepoPosYVal"
            value={options.position?.y}
            onChange={(value) => {
              setOptions({
                ...options,
                position: {
                  y: value,
                  x: options.position.x,
                },
              });
            }}
          />
        </Group>
      </Card>
    </Stack>
  );
}
