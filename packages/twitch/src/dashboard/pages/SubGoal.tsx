import { AddIcon } from "@chakra-ui/icons"
import { Box, Heading, IconButton } from "@chakra-ui/react"
import React, { ReactElement, useEffect } from "react"
import { SubmitHandler } from "react-hook-form"
import { useReplicant } from "use-nodecg"
import SubGoals, { Inputs } from "../components/SubGoals"

interface Props {}

export default function SubGoal({}: Props): ReactElement {
  const [goals, setGoals] = useReplicant<Inputs["subGoals"], null>("subGoals", null, {
    defaultValue: [],
    persistent: true,
  })
  const addGoal: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (goals === null || goals.includes({ reward: "", goal: 0 })) return
    else goals.push({ reward: "", goal: 0 })
  }
  useEffect(() => console.log("rendering"), [])
  const onSubmit: SubmitHandler<Inputs["subGoals"]> = (data) => {
    console.log("Submitting Data: ", data)
    let arr: Inputs["subGoals"] = []
    for (const key in data) {
      arr.push({ reward: data[key].reward, goal: data[key].goal, completed: false })
    }
    setGoals(arr)
  }
  return (
    <Box w="100%" h="100%" className="flex flex-col items-center">
      <Heading as="h3">Sub Goals</Heading>
      <IconButton
        icon={<AddIcon />}
        aria-label="Add New"
        className="mt-4 ml-4"
        pos="absolute"
        left="0"
        colorScheme="purple"
        onClick={addGoal}
      />
      {goals && <SubGoals goals={goals} onSubmit={onSubmit} />}
    </Box>
  )
}
