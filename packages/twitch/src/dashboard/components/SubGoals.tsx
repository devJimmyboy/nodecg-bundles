import React, { ReactElement, useEffect } from "react"
import { useForm, SubmitHandler, FormProvider, useFormContext } from "react-hook-form"
import AutoSizer from "react-virtualized-auto-sizer"
import memoize from "memoize-one"
import { VariableSizeList as List } from "react-window"
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Divider,
  Heading,
  Table,
  Flex,
  HStack,
  NumberInput,
  VStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Box,
  IconButton,
  Checkbox,
} from "@chakra-ui/react"
import { useReplicant } from "use-nodecg"
import { DeleteIcon } from "@chakra-ui/icons"
interface Props {
  goals: Inputs["subGoals"]
  onSubmit: SubmitHandler<Inputs["subGoals"]>
}

export type Goal = { reward: string; goal: number; completed?: boolean }

export type Inputs = {
  subGoals: Goal[]
}

const createItemData = memoize((goals, updateGoal) => ({
  goals,

  updateGoal,
}))

const WindowedRow = React.memo<
  import("react-window").ListChildComponentProps<{
    goals: Inputs["subGoals"]
    updateGoal: (index: number, goal: Goal | "delete") => void
  }>
>(({ index, style, data }) => {
  const { goals, updateGoal } = data
  const goal = goals[index]

  return (
    <>
      <HStack
        className="m-2 bg-neutral text-neutral-content"
        key={index}
        px={6}
        py={8}
        spacing={4}
        // background="gray.50"
        style={style}
        rounded="lg">
        <FormControl className="flex-grow">
          <FormLabel htmlFor="reward">Reward</FormLabel>
          <Input
            id="reward"
            placeholder="Reward"
            defaultValue={goal.reward}
            onBlur={(e) => {
              updateGoal(index, { ...goal, reward: e.target.value })
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="goal">Goal</FormLabel>
          <NumberInput
            id="goal"
            step={5}
            min={-1}
            defaultValue={goal.goal}
            onChange={(e) => {
              updateGoal(index, { ...goal, goal: parseInt(e) })
            }}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl className="">
          <Checkbox
            className="w-20"
            id="completed"
            size="md"
            defaultIsChecked={goal.completed}
            onChange={(e) => {
              updateGoal(index, { ...goal, completed: e.target.checked })
            }}>
            Completed
          </Checkbox>
        </FormControl>
        <IconButton
          aria-label="Delete Goal"
          icon={<DeleteIcon />}
          alignSelf="flex-end"
          justifySelf="flex-end"
          colorScheme="red"
          onClick={(e) => updateGoal(index, "delete")}
        />
      </HStack>
    </>
  )
})
export default function SubGoals({ goals, onSubmit }: Props): ReactElement {
  const updateGoal = (index: number, value: Goal | "delete") => {
    let newGoals = [...goals]

    if (value === "delete") {
      newGoals.splice(index, 1)
    } else {
      newGoals[index] = value
    }
    onSubmit(newGoals)
  }

  const itemData = createItemData(goals, updateGoal)

  useEffect(() => console.log("Goals on Form Render: ", goals), [])

  if (goals === null) return <Heading as="h4">Loading Goals...</Heading>
  else
    return (
      <div className="w-full  flex flex-col items-center">
        {goals.length == 0 && (
          <Box rounded="md" className="p-4 bg-base-200 text-base-content" shadow="lg" my="10">
            {"<--"}Add a goal to get started!
          </Box>
        )}
        {goals.length > 0 && (
          <List
            height={500}
            className="bg-base-200 rounded-lg p-2 shadow-xl"
            style={{ margin: "0" }}
            width="85%"
            layout="vertical"
            itemCount={goals.length}
            itemSize={(i) => 100}
            itemData={itemData}>
            {WindowedRow}
          </List>
        )}
        {/* <Button onClick={() => {}} disabled={goals.length == 0}>
          Submit
        </Button> */}
      </div>
    )
}
