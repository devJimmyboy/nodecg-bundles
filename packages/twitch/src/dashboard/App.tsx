import React, { ReactElement } from "react"
import "react-widgets/styles.css"
import {
  Input,
  Button,
  Divider,
  Heading,
  IconButton,
  Box,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react"
import SubGoal from "./pages/SubGoal"
import Rewards from "./pages/Rewards"

const pages = [
  { Page: SubGoal, name: "Sub Goals" },
  { Page: Rewards, name: "Rewards" },
]

interface Props {}

export default function App({}: Props): ReactElement {
  return (
    <div className="h-full w-full p-2 flex flex-col items-center">
      <Heading as="h1" color="white" fontFamily="'Lilita One', 'Segoe UI', sans-serif">
        Twitch Config
      </Heading>
      <Divider mb={6} />
      <Tabs isFitted variant="enclosed" w="100%">
        <TabList>
          {pages.map(({ name }, i) => (
            <Tab _selected={{ background: "white", color: "unset" }} color="white" fontWeight={700} key={i}>
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {pages.map(({ Page, name }, i) => {
            return (
              <TabPanel key={i}>
                <Page />
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </div>
  )
}
