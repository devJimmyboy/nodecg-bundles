import React, { ReactElement, useEffect } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import memoize from "memoize-one";
import { VariableSizeList as List } from "react-window";
import {
  Input,
  Button,
  Divider,
  Table,
  NumberInput,
  Box,
  Checkbox,
  Group,
  TextInput,
  ActionIcon,
  Title,
  Stack,
} from "@mantine/core";
import { useReplicant } from "use-nodecg";
import { DeleteIcon } from "@chakra-ui/icons";
interface Props {
  goals: Inputs["subGoals"];
  onSubmit: (vals: Inputs["subGoals"]) => void;
}

export type Goal = { reward: string; goal: number; completed?: boolean };

export type Inputs = {
  subGoals: Goal[];
};

const createItemData = memoize((goals, updateGoal) => ({
  goals,

  updateGoal,
}));

const WindowedRow = React.memo<
  import("react-window").ListChildComponentProps<{
    goals: Inputs["subGoals"];
    updateGoal: (index: number, goal: Goal | "delete") => void;
  }>
>(({ index, style, data }) => {
  const { goals, updateGoal } = data;
  const goal = goals[index];

  return (
    <>
      <Group
        key={index}
        spacing={4}
        // background="gray.50"
        style={style}
        sx={{
          borderRadius: 4,
          // position: "relative",
        }}
      >
        <TextInput
          label="Reward"
          id="reward"
          placeholder="Reward"
          value={goal.reward}
          onChange={(e) => {
            updateGoal(index, { ...goal, reward: e.target.value });
          }}
        />

        <NumberInput
          id="goal"
          label="Goal"
          step={5}
          min={-1}
          defaultValue={goal.goal}
          onChange={(e) => {
            updateGoal(index, { ...goal, goal: e });
          }}
        />
        <div className="flex-grow" />

        <Checkbox
          className="w-20"
          id="completed"
          size="md"
          label="Completed"
          onChange={(e) => {
            updateGoal(index, { ...goal, completed: e.target.checked });
          }}
        />

        <ActionIcon
          aria-label="Delete Goal"
          sx={{
            alignSelf: "flex-end",
            justifySelf: "flex-end",
          }}
          color="red"
          onClick={(e) => updateGoal(index, "delete")}
        >
          <DeleteIcon />
        </ActionIcon>
      </Group>
    </>
  );
});
export default function SubGoals({ goals, onSubmit }: Props): ReactElement {
  const updateGoal = (index: number, value: Goal | "delete") => {
    let newGoals = [...goals];

    if (value === "delete") {
      newGoals.splice(index, 1);
    } else {
      newGoals[index] = value;
    }
    onSubmit(newGoals);
  };

  const itemData = createItemData(goals, updateGoal);

  useEffect(() => console.log("Goals on Form Render: ", goals), []);

  if (goals === null) return <Title order={4}>Loading Goals...</Title>;
  else
    return (
      <Stack className="w-full h-full" align="center">
        {goals.length == 0 ? (
          <Box
            className="p-4 bg-base-200 text-base-content"
            sx={{
              borderRadius: 4,
              mx: 4,
            }}
          >
            {"<--"}Add a goal to get started!
          </Box>
        ) : (
          <AutoSizer defaultHeight={400}>
            {({ width, height }) => (
              <List
                height={height}
                className="bg-base-200 rounded-lg p-2 shadow-xl"
                style={{ margin: "0" }}
                width={width}
                layout="vertical"
                itemCount={goals.length}
                itemSize={(i) => 100}
                itemData={itemData}
              >
                {WindowedRow}
              </List>
            )}
          </AutoSizer>
        )}
        {/* <Button onClick={() => {}} disabled={goals.length == 0}>
          Submit
        </Button> */}
      </Stack>
    );
}
