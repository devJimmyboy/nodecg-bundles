import { Box, Group, Stack, TextInput } from "@mantine/core";
import React, { ReactElement, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useReplicant } from "use-nodecg";
import { CustomReward } from "../../extension";
import ActionEditor from "./ActionEditor";

interface Props {}

interface FormFields {
  rewards: CustomReward[];
}

export default function RewardsForm({}: Props): ReactElement {
  const [rewards, setRewards] = useReplicant<CustomReward[], null>(
    "customRewards",
    null
  );
  const [selectedReward, setReward] = useState(0);
  // const editorRef = useRef(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({});
  const onSubmit: SubmitHandler<FormFields> = (data) => {};
  if (rewards === null) return <Box>Loading Rewards...</Box>;
  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Group sx={{ width: "100%" }}>
        {rewards?.map((reward, i) => (
          <Stack
            key={`reward-${i}`}
            sx={{
              width: "100%",
              height: "150px",
              display: selectedReward == i ? "flex" : "none",
            }}
          >
            <TextInput
              defaultValue={reward.title}
              {...register(`rewards.${i}.title`)}
            />
          </Stack>
        ))}
        <Box
          sx={{
            width: "100%",
            height: 350,
            overflow: "hidden",
            borderRadius: "lg",
          }}
        >
          {/* <ActionEditor ref={editorRef} /> */}
        </Box>
      </Group>
    </form>
  );
}
