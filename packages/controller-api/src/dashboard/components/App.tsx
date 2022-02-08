import {
  Flex,
  Button,
  Text,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react"
import React, { ReactElement } from "react"

interface Props {}

export default function App({}: Props): ReactElement {
  const [logs, setLogs] = React.useState<string[]>([])

  React.useEffect(() => {
    const listener = (log: string) => {
      setLogs((prev) => {
        prev.push(log)
        return prev
      })
    }
    nodecg.listenFor("stdout", listener)
    return () => {
      nodecg.unlisten("stdout", listener)
    }
  }, [])

  return (
    <Flex bg="transparent" gap={8} direction="column" p={8}>
      <AreYouSure
        trigger={
          <Button alignSelf="flex-start" p={4} colorScheme="green">
            Restart
          </Button>
        }
        onConfirm={() => {
          nodecg.sendMessage("nodecgRestart")
        }}
      />
      <Flex
        rounded="lg"
        bg="gray.300"
        w="100%"
        minH="120px"
        maxH="360px"
        overflowX="hidden"
        overflowY="scroll"
        direction="column-reverse"
        justify="end">
        {logs.map((log, i) => (
          <Text key={i} fontWeight={700} color="white">
            {log}
          </Text>
        ))}
      </Flex>
    </Flex>
  )
}

const AreYouSure = (props: { trigger: ReactElement; onConfirm: () => void }): ReactElement => (
  <Popover>
    <PopoverTrigger>{props.trigger}</PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Are you sure?</PopoverHeader>
      <PopoverBody>
        <Button colorScheme="red" onClick={props.onConfirm}>
          Confirm
        </Button>
      </PopoverBody>
    </PopoverContent>
  </Popover>
)
