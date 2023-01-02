import { Box, Stack, Title } from "@mantine/core";
import React, { ReactElement } from "react";
import { useReplicant } from "use-nodecg";
import { CustomReward } from "../../extension/index";
import RewardsForm from "../components/RewardsForm";

interface Props {}

export default function Rewards({}: Props): ReactElement {
  const [rewards, setRewards] = useReplicant<CustomReward[], null>(
    "customRewards",
    null
  );
  if (rewards === null) return <Box>Rewards Loading...</Box>;
  return (
    <Stack sx={{ width: "100%", height: "100%" }} align="center">
      <Title order={2}>Channel Rewards</Title>
      <RewardsForm />
    </Stack>
  );
}
