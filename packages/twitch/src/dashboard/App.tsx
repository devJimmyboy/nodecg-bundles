import React, { ReactElement } from "react"
import "react-widgets/styles.css"
import { Input, Button, Divider, Heading, IconButton, Box } from "@chakra-ui/react"
import SubGoals from "./components/SubGoals"
import { AddIcon } from "@chakra-ui/icons"

interface Props {}

export default function App({}: Props): ReactElement {
  return (
    <div className="h-full w-full p-2 flex flex-col items-center">
      <Heading as="h1" fontFamily="'Lilita One', 'Segoe UI', sans-serif">
        Twitch Config
      </Heading>
      <Divider />
      <Box pos="relative" w="100%" className="flex flex-col items-center">
        <Heading as="h3">Sub Goals</Heading>
        <IconButton
          icon={<AddIcon />}
          aria-label="Add New"
          className="mt-4"
          pos="absolute"
          left="0"
          colorScheme="purple"
          onClick={addGoal}
        />
        <SubGoals />
      </Box>
    </div>
  )
}

const addGoal: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  const rep = nodecg.Replicant<{ reward: string; goal: number }[]>("subGoals")
  NodeCG.waitForReplicants(rep).then(() => {
    if (typeof rep.value === "undefined") rep.value = [{ reward: "", goal: -1 }]
    else if (rep.value.includes({ reward: "", goal: -1 })) return
    else rep.value.push({ reward: "", goal: -1 })
  })
}
