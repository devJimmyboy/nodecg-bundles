import { Box, Flex, Input } from "@chakra-ui/react"
import React, { ReactElement, useRef, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useReplicant } from "use-nodecg"
import { CustomReward } from "../../../extension/index"
import ActionEditor from "./ActionEditor"

interface Props {}

interface FormFields {
  rewards: CustomReward[]
}

export default function RewardsForm({}: Props): ReactElement {
  const [rewards, setRewards] = useReplicant<CustomReward[], null>("customRewards", null)
  const [selectedReward, setReward] = useState(0)
  const editorRef = useRef(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({})
  const onSubmit: SubmitHandler<FormFields> = (data) => {}
  if (rewards === null) return <Box>Loading Rewards...</Box>
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {rewards.map((reward, i) => (
        <Flex key={`reward-${i}`} display={selectedReward == i ? "flex" : "none"} direction="column">
          <Input defaultValue={reward.title} {...register(`rewards.${i}.title`)} />
        </Flex>
      ))}
      <Box w="100%">
        <ActionEditor {...register(`rewards.${selectedReward}.action`)} ref={editorRef} />
      </Box>
    </form>
  )
}
