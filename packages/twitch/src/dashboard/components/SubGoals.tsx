import React, { ReactElement, useEffect } from "react"
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
import { useReplicant } from "use-nodecg"
interface Props {
  goals: Inputs["subGoals"]
  onSubmit: SubmitHandler<Inputs["subGoals"]>
}

export type Inputs = {
  subGoals: { reward: string; goal: number; completed?: boolean }[]
}

const WindowedRow = React.memo<import("react-window").ListChildComponentProps<Inputs["subGoals"]>>(
  ({ index, style, data }) => {
    const { register } = useFormContext()

    return (
      <>
        <HStack
          className="bg-neutral text-neutral-content mb-2 px-6 py-8 border-b-2 border-neutral-content"
          spacing={4}
          style={style}>
          <FormControl className="flex-grow">
            <FormLabel htmlFor="reward">Reward</FormLabel>
            <Input
              id="reward"
              placeholder="Reward"
              {...register(`${index}.reward`)}
              defaultValue={data[index].reward}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="goal">Goal</FormLabel>
            <NumberInput id="goal" step={5} min={-1} defaultValue={data[index].goal}>
              <NumberInputField {...register(`${index}.goal`, { valueAsNumber: true })} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>
      </>
    )
  }
)
export default function SubGoals({ goals, onSubmit }: Props): ReactElement {
  let formMethods = useForm({
    defaultValues: goals,
  })
  useEffect(() => console.log("Goals on Form Render: ", goals), [])

  if (goals === null) return <Heading as="h4">Loading Goals...</Heading>
  else
    return (
      <form className="w-full  flex flex-col items-center" onSubmit={formMethods.handleSubmit(onSubmit)}>
        {goals.length == 0 && (
          <Box rounded="md" className="p-4 bg-base-200 text-base-content" shadow="lg" my="10">
            {"<--"}Add a goal to get started!
          </Box>
        )}
        {goals.length > 0 && (
          <FormProvider {...formMethods}>
            <List
              height={500}
              className="bg-base-200 rounded-lg shadow-xl text-base-content"
              style={{ margin: "1.5rem", padding: "1rem 1.5rem" }}
              width="80%"
              layout="vertical"
              itemCount={goals.length}
              itemSize={(i) => 100}
              itemData={goals}>
              {WindowedRow}
            </List>
          </FormProvider>
        )}
        <Button type="submit" disabled={goals.length == 0}>
          Submit
        </Button>
      </form>
    )
}
