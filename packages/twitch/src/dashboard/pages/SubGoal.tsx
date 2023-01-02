import { AddIcon } from "@chakra-ui/icons";
import { ActionIcon, Box, Divider, Stack, Title } from "@mantine/core";
import React, { ReactElement, useEffect } from "react";
import { useReplicant } from "use-nodecg";
// import CSSEditor from "../components/editor"
import SubGoals, { Inputs } from "../components/SubGoals";

interface Props {}

export default function SubGoal({}: Props): ReactElement {
  const [goals, setGoals] = useReplicant<Inputs["subGoals"], null>(
    "subGoals",
    null
  );
  const addGoal: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (goals === null || goals.includes({ reward: "", goal: 0 })) return;
    else goals.push({ reward: "", goal: 0 });
  };
  useEffect(() => console.log("rendering"), []);
  const onSubmit: (vals: Inputs["subGoals"]) => void = (data) => {
    console.log("Submitting Data: ", data);
    let arr: Inputs["subGoals"] = data.map((goal) => ({
      reward: goal.reward,
      goal: goal.goal,
      completed: goal.completed ?? false,
    }));

    setGoals(arr);
  };
  return (
    <Stack align="center" sx={{ width: "100%", height: "100%" }}>
      <Title order={3}>Sub Goals</Title>
      <ActionIcon
        aria-label="Add New"
        title="Add New"
        className="mt-4 ml-4"
        color="purple"
        onClick={addGoal}
        sx={{
          position: "absolute",
          left: 0,
        }}
      >
        <AddIcon />
      </ActionIcon>
      {goals && <SubGoals goals={goals} onSubmit={onSubmit} />}
      <Divider my="25px" size="md" />
      {/* <CSSEditor /> */}
    </Stack>
  );
}
