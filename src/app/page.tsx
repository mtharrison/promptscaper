"use client";

import { AlertDialogComponent } from "./components/modals/AlertDialogComponent";
import { HeaderBar } from "./components/HeaderBar";
import { Chat } from "./components/panels/chat/Chat";
import { Functions } from "./components/panels/Functions";
import { Options } from "./components/panels/Options";

import { Flex, Text } from "@chakra-ui/react";
import { useAppStore } from "./state";

export default function Home() {
  const { dialog, panels } = useAppStore(({ workspace }) => ({
    dialog: workspace.dialog,
    panels: workspace.panels,
  }));
  return (
    <Flex h={"100vh"} flexDirection={"column"} px={10} py={5} gap={3}>
      <AlertDialogComponent {...dialog} />
      <HeaderBar />
      <Flex flex={"1 1 auto"} gap={5} overflow={"hidden"} flexDirection={"row"}>
        <Chat />
        <Flex flex={"1 2 auto"} flexDirection={"column"} gap={5}>
          {panels.functions.visible && <Functions />}
          {panels.config.visible && <Options />}
        </Flex>
      </Flex>
    </Flex>
  );
}
