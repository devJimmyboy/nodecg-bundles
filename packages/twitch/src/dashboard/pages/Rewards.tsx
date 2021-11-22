import { Box, Flex, Heading } from "@chakra-ui/react"
import React, { ReactElement } from "react"
import { useReplicant } from "use-nodecg"
import { CustomReward } from "../../../extension/index"
import RewardsForm from "../components/RewardsForm"

interface Props {}

export default function Rewards({}: Props): ReactElement {
  const [rewards, setRewards] = useReplicant<CustomReward[], null>("customRewards", null)
  if (rewards === null) return <Box>Rewards Loading...</Box>
  return (
    <Flex w="100%" h="100%" direction="column" align="center">
      <Heading as="h2">Channel Rewards</Heading>
      <RewardsForm />
    </Flex>
  )
}
