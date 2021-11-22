import React, { ReactElement } from "react"
import "react-widgets/styles.css"
import { Input, Button, Divider, Heading, IconButton, Box, Grid, GridItem } from "@chakra-ui/react"
import SubGoal from "./pages/SubGoal"
import Rewards from "./pages/Rewards"

const pages = [SubGoal, Rewards]

interface Props {}

export default function App({}: Props): ReactElement {
  return (
    <div className="h-full w-full p-2 flex flex-col items-center">
      <Heading as="h1" fontFamily="'Lilita One', 'Segoe UI', sans-serif">
        Twitch Config
      </Heading>
      <Divider />
      <Grid templateColumns={`repeat(${pages.length},1fr)`} gap={4} w="100%">
        {pages.map((Page, i) => {
          return (
            <GridItem key={i}>
              <Page />
            </GridItem>
          )
        })}
      </Grid>
    </div>
  )
}
