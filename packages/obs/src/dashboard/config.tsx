import "./index.css";
import { PositionConfig, OBSConfig } from "../../global";
import ReactDOM from "react-dom/client";
import {
  Button,
  Group,
  MantineProvider,
  Modal,
  ModalProps,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useReplicant } from "use-nodecg";
import React from "react";
import { ModalsProvider } from "@mantine/modals";
import { useForm, UseFormReturnType } from "@mantine/form";
import OBSWebSocket, {
  EventSubscription,
  OBSWebSocketError,
} from "obs-websocket-js";
import { ReplicantBrowser } from "nodecg-types/types/server";
// var position = nodecg.Replicant<PositionConfig>("posLogo");
// var obsConfig = nodecg.Replicant<OBSConfig>("obsConfig");

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <MantineProvider
    theme={{ colorScheme: "dark" }}
    withGlobalStyles
    withNormalizeCSS
  >
    <ModalsProvider>
      <App />
    </ModalsProvider>
  </MantineProvider>
);

const data = [
  {
    value: "top-right",
    label: "Top Right",
  },
  {
    value: "top-left",
    label: "Top Left",
  },
  {
    value: "top-center",
    label: "Top Middle",
  },
  {
    value: "bottom-center",
    label: "Bottom Middle",
  },
  {
    value: "bottom-left",
    label: "Bottom Left",
  },
  {
    value: "bottom-right",
    label: "Bottom Right",
  },
];

function App() {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = useReplicant<PositionConfig, null>("posLogo", null);
  React.useEffect(() => {
    if (pos) {
      console.dir(pos);
    }
  }, [pos]);

  const positionFinal = pos
    ? (pos[0] ? "bottom" : "top") +
      "-" +
      (pos[1] ? (pos[1] === 0.5 ? "center" : "right") : "left")
    : "top-right";

  return (
    <Stack align="center" className="w-full h-full py-2" justify="center">
      <Button.Group>
        <Button
          variant="default"
          id="refreshBtn"
          onClick={() => nodecg.sendMessage("refreshClient")}
        >
          Reconnect to OBS
        </Button>
        <Button variant="default" onClick={() => setOpen(true)}>
          Edit Config
        </Button>
      </Button.Group>
      <div className="form-control w-full max-w-sm">
        <Select
          value={positionFinal}
          data={data}
          name="position"
          label="Logo Position"
          placeholder="Pick a Corner"
          onChange={(val) => {
            let final = [0, 0] as PositionConfig;
            val?.split("-").forEach((pos) => {
              switch (pos) {
                case "top":
                  final[0] = 0;
                  break;
                case "bottom":
                  final[0] = 1;
                  break;
                case "left":
                  final[1] = 0;
                  break;
                case "right":
                  final[1] = 1;
                  break;
                case "center":
                  final[1] = 0.5;
                  break;
              }
            });
            setPos(final);
          }}
        />
      </div>
      <ConfigEditModal
        opened={open}
        onClose={() => setOpen(false)}
        title="Edit Config"
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        closeButtonLabel="Cancel Edits and Close"
      />
    </Stack>
  );
}

// Debug in Console
declare global {
  interface Window {
    form: UseFormReturnType<OBSConfig>;
    config: ReplicantBrowser<OBSConfig>;
  }
}

window.config = nodecg.Replicant("obsConfig");

function ConfigEditModal(props: ModalProps) {
  const [config, setConfig] = useReplicant<OBSConfig, OBSConfig>("obsConfig", {
    password: "",
    url: "",
    port: 4444,
  });
  const form = useForm<OBSConfig>({
    initialValues: config,
    validateInputOnBlur: true,
    validate(values) {
      if (!values) return {};

      return {
        url: values.url.length < 2 ? "Required" : null,
        port: values.port === undefined ? "Required" : null,
      };
    },
  });
  React.useEffect(() => {
    window.form = form;
    if (config) {
      console.dir(config);
    }
    if (!form.values) {
      form.setValues(config);
    }
  }, [config]);

  return (
    <Modal {...props}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          console.dir(values);

          setConfig(values);
          props.onClose();
        })}
      >
        <TextInput
          withAsterisk
          label="OBS Websocket URL/IP"
          required
          type="other"
          {...form.getInputProps("url")}
        />
        <NumberInput
          withAsterisk
          label="OBS Websocket Port"
          required
          {...form.getInputProps("port")}
        />
        <PasswordInput
          withAsterisk
          label="OBS Websocket Password"
          required
          type="other"
          {...form.getInputProps("password")}
        />
        <Button type="submit" variant="default">
          Save
        </Button>
      </form>
    </Modal>
  );
}
