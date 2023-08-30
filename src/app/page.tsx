"use client";

import { AlertDialogComponent } from "./components/modals/AlertDialogComponent";
import { HeaderBar } from "./components/HeaderBar";
import { Chat } from "./components/panels/chat/Chat";
import { Functions } from "./components/panels/Functions";
import { Options } from "./components/panels/Options";

import { Flex, Text } from "@chakra-ui/react";
import { useAppStore } from "./state";

import userflow from "userflow.js";
import { useEffect } from "react";

userflow.init("ct_wfobtiv5hzhavo5h4m44qn2x5q");
userflow.identifyAnonymous({
  website_lead: true,
});

export default function Home() {
  useEffect(() => {
    userflow.start("7200cc34-31dd-40d4-abe9-a3b3a382fa85");
  }, []);

  const { dialog, panels } = useAppStore(({ workspace }) => ({
    dialog: workspace.dialog,
    panels: workspace.panels,
  }));
  return (
    <Flex
      flexDirection={"column"}
      h={"100vh"}
      maxH={"100vh"}
      flexFlow={"column"}
      p={5}
      gap={3}
    >
      <AlertDialogComponent {...dialog} />
      <HeaderBar />
      <Flex flex={"1 1 0"} minH={0} gap={5} flexWrap={"wrap"}>
        <Chat />
        <Flex
          flex={"1 1 0"}
          minH={0}
          minW={"400px"}
          gap={5}
          flexDirection={"column"}
        >
          {panels.functions.visible && <Functions />}
          {panels.config.visible && <Options />}
        </Flex>
      </Flex>
    </Flex>
  );
}
