import React, { ReactElement, useEffect, useRef } from "react";
import "react-widgets/styles.css";
import {
  Input,
  Button,
  Divider,
  Title,
  ActionIcon,
  Box,
  Grid,
  Tabs,
  Stack,
} from "@mantine/core";
import SubGoal from "./pages/SubGoal";
import Rewards from "./pages/Rewards";
import "./components/editor/monaco/theme";

const pages = [
  { Page: SubGoal, name: "Sub Goals" },
  { Page: Rewards, name: "Rewards" },
];

interface Props {}

export default function App({}: Props): ReactElement {
  return (
    <Stack spacing={2} align="center" p={8} sx={{height: "100%"}}>
      <Stack spacing={6} align="center" justify="stretch">
        <Button
          sx={{ position: "fixed", bottom: 4, right: 4 }}
          onClick={() => window.nodecg.sendMessage("refresh")}
        >
          Refresh
        </Button>
        <Title order={1} color="white">
          Twitch Config
        </Title>
      </Stack>

      <Tabs
        defaultValue={pages[0].name}
        variant="default"
        // sx={{ width: "100%" }}

        styles={{
          root: {
            width: "100%",
           
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          },
          tab: {
            flexGrow: 1,
          },
          tabsList: {
            width: "auto",
          },
          panel: {
            width: "100%",
            paddingTop: 12,
            flexGrow: 1,
          },
        }}
      >
        <Tabs.List>
          {pages.map(({ name }, i) => (
            <Tabs.Tab value={name} sx={{ fontWeight: 700 }} key={i}>
              {name}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {pages.map(({ Page, name }, i) => {
          return (
            <Tabs.Panel value={name} key={i}>
              <Page />
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Stack>
  );
}
