import {
  Stack,
  Group,
  Button,
  Text,
  Popover,
  CloseButton,
  Title,
} from "@mantine/core";
import React, { ReactElement } from "react";

interface Props {}

export default function App({}: Props): ReactElement {
  const [logs, setLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    const listener = (log: string) => {
      setLogs((prev) => {
        prev.push(log);
        return prev;
      });
    };
    nodecg.listenFor("stdout", listener);
    return () => {
      nodecg.unlisten("stdout", listener);
    };
  }, []);

  return (
    <Stack spacing={8} p={8} pb={96}>
      <AreYouSure
        trigger={
          <Button fullWidth p={4} color="green">
            Restart
          </Button>
        }
        onConfirm={() => {
          nodecg.sendMessage("nodecgRestart");
        }}
      />
      <Stack>
        {logs.map((log, i) => (
          <Text key={i} weight={700} color="white">
            {log}
          </Text>
        ))}
      </Stack>
    </Stack>
  );
}

const AreYouSure = (props: {
  trigger: ReactElement;
  onConfirm: () => void;
}): ReactElement => (
  <Popover withArrow>
    <Popover.Target>{props.trigger}</Popover.Target>
    <Popover.Dropdown>
      <Group>
        <CloseButton />
        <Title order={4}>Are you sure?</Title>
      </Group>
      <Button color="red" onClick={props.onConfirm}>
        Confirm
      </Button>
    </Popover.Dropdown>
  </Popover>
);
