import React, { ReactElement } from "react"
import { useForm, SubmitHandler, FormProvider, useFormContext } from "react-hook-form"
import AutoSizer from "react-virtualized-auto-sizer"
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
} from "@chakra-ui/react"
interface Props {}

export type Inputs = {
  subGoals: { reward: string; goal: number }[]
}

const subGoals = nodecg.Replicant<Inputs["subGoals"]>("subGoals")

const WindowedRow = React.memo<import("react-window").ListChildComponentProps<Inputs["subGoals"]>>(
  ({ index, style, data }) => {
    const { register } = useFormContext()

    return (
      <HStack className="bg-neutral-content rounded mb-2 px-6" spacing={4} style={style}>
        <FormControl className="flex-grow">
          <FormLabel htmlFor="reward">Reward</FormLabel>
          <Input id="reward" placeholder="Reward" {...register(`${index}.reward`)} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="goal">Goal</FormLabel>
          <NumberInput id="goal" placeholder="Goal">
            <NumberInputField {...register(`${index}.goal`, { valueAsNumber: true })} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </HStack>
    )
  }
)

export default function SubGoals({}: Props): ReactElement {
  const [goals, setGoals] = React.useState<Inputs["subGoals"]>([])
  React.useEffect(() => {
    NodeCG.waitForReplicants(subGoals).then(() => onSubGoalChange(subGoals.value))
    const onSubGoalChange = (newGoals) => newGoals && setGoals(Array.from(newGoals))
    subGoals.on("change", onSubGoalChange)
    return () => {
      subGoals.removeListener("change", onSubGoalChange)
    }
  }, [])

  const formMethods = useForm({ defaultValues: goals })
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    subGoals.value = data.subGoals
    console.log(data, goals)
  }
  return (
    <form className="w-full mx-10 flex flex-col items-center" onSubmit={formMethods.handleSubmit(onSubmit)}>
      {goals && goals.length > 0 && (
        <FormProvider {...formMethods}>
          <List
            height={500}
            className="bg-base-200 rounded-lg shadow-xl"
            style={{ margin: 6, padding: "4 6" }}
            width="80%"
            layout="vertical"
            itemCount={goals.length}
            itemSize={(i) => 80}
            itemData={goals}>
            {WindowedRow}
          </List>
        </FormProvider>
      )}
      <Button type="submit">Submit</Button>
    </form>
  )
}
