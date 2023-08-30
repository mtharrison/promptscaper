"use client";

import {
  Flex,
  Heading,
  Button,
  IconButton,
  Tooltip,
  HStack,
  Text,
} from "@chakra-ui/react";

// Chat
import {
  AiOutlineFolderOpen,
  AiOutlineFork,
  AiOutlinePlus,
  AiOutlinePlusSquare,
  AiOutlineSave,
  AiFillEye,
  AiOutlineEyeInvisible,
  AiFillEyeInvisible,
} from "react-icons/ai";

import Image from "next/image";
import Logo from "../../../public/logo.png";

import { BiUndo, BiRedo, BiImport, BiExport } from "react-icons/bi";

import { useAppStore, useTemporalStore } from "../state";

import { OpenModal } from "./modals/OpenModal";
import { SaveModal } from "./modals/SaveModal";
import { useEffect, useState } from "react";

export function HeaderBar() {
  const { undo, redo, pastStates, futureStates } = useTemporalStore(
    (state) => state
  );

  const {
    newWorkspace,
    showOpenModal,
    showSaveModal,
    exportWorkspace,
    importWorkspace,
    toggleFunctionsPanelVisibility,
    toggleConfigPanelVisibility,
    toggleLogsPanelVisibility,
    functionsVisible,
    configVisible,
    logsVisible,
  } = useAppStore(({ workspaceActions, workspace }) => ({
    newWorkspace: workspaceActions.newWorkspace,
    showOpenModal: workspaceActions.showOpenModal,
    hideOpenModal: workspaceActions.hideOpenModal,
    showSaveModal: workspaceActions.showSaveModal,
    hideSaveModal: workspaceActions.hideSaveModal,
    toggleFunctionsPanelVisibility:
      workspaceActions.toggleFunctionsPanelVisibility,
    toggleConfigPanelVisibility: workspaceActions.toggleConfigPanelVisibility,
    toggleLogsPanelVisibility: workspaceActions.toggleLogsPanelVisibility,
    exportWorkspace: workspaceActions.exportWorkspace,
    importWorkspace: workspaceActions.importWorkspace,
    functionsVisible: workspace.panels.functions.visible,
    configVisible: workspace.panels.config.visible,
    logsVisible: workspace.panels.logs.visible,
  }));

  const canUndo = !!pastStates.length;
  const canRedo = !!futureStates.length;

  const [showLogo, setShowLogo] = useState(false);
  useEffect(() => setShowLogo(true), []);

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"baseline"}
      flexWrap={"wrap"}
      flex={"0 0 0"}
    >
      <Flex
        alignItems={"center"}
        gap={5}
        justifyContent={"space-between"}
        flex={"1 1 auto"}
        flexWrap={"wrap"}
      >
        <Flex flex={"0 0 auto"} gap={10} alignItems={"center"}>
          {showLogo && (
            <Image
              id="logo"
              alt="PromptScaper"
              width={50}
              height={50}
              src={Logo.src}
            />
          )}
          <HStack bg="blackAlpha.100" p={2} rounded={"lg"} boxShadow={"sm"}>
            <Button
              leftIcon={<AiOutlinePlus />}
              onClick={newWorkspace}
              size={"sm"}
              colorScheme="blackAlpha"
            >
              New
            </Button>
            <Button
              size={"sm"}
              leftIcon={<AiOutlineFolderOpen />}
              onClick={showOpenModal}
              colorScheme="blackAlpha"
            >
              Open
            </Button>

            <Button
              leftIcon={<AiOutlineSave />}
              size={"sm"}
              onClick={showSaveModal}
              colorScheme="blackAlpha"
            >
              Save
            </Button>
            <Tooltip label="Undo" aria-label="Undo">
              <IconButton
                isDisabled={!canUndo}
                onClick={() => undo(1)}
                size={"sm"}
                icon={<BiUndo />}
                aria-label="Undo"
                colorScheme="blackAlpha"
              />
            </Tooltip>
            <Tooltip label="Redo" aria-label="Redo">
              <IconButton
                isDisabled={!canRedo}
                onClick={() => redo(1)}
                size={"sm"}
                icon={<BiRedo />}
                aria-label="Redo"
                colorScheme="blackAlpha"
              />
            </Tooltip>
          </HStack>
        </Flex>

        <Flex flex={"0 0 auto"} gap={5} alignItems={"center"}>
          <HStack bg="blackAlpha.100" p={2} rounded={"lg"} boxShadow={"sm"}>
            <Tooltip
              label="Export current workspace to JSON"
              aria-label="Export current workspace to JSON"
            >
              <Button
                size={"sm"}
                leftIcon={<BiExport />}
                colorScheme="blackAlpha"
                onClick={exportWorkspace}
              >
                Export
              </Button>
            </Tooltip>
            <Tooltip
              label="Import workspace from JSON"
              aria-label="Import workspace from JSON"
            >
              <Button
                size={"sm"}
                leftIcon={<BiImport />}
                colorScheme="blackAlpha"
                onClick={importWorkspace}
              >
                Import
              </Button>
            </Tooltip>
          </HStack>
        </Flex>

        <HStack bg="blackAlpha.100" p={2} rounded={"lg"} boxShadow={"sm"}>
          <Button
            leftIcon={functionsVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
            onClick={toggleFunctionsPanelVisibility}
            colorScheme="blackAlpha"
            size={"sm"}
          >
            Functions editor
          </Button>

          <Button
            leftIcon={configVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
            onClick={toggleConfigPanelVisibility}
            colorScheme="blackAlpha"
            size={"sm"}
          >
            LLM Config
          </Button>

          {/* <Button
            leftIcon={logsVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
            onClick={toggleLogsPanelVisibility}
            colorScheme="blackAlpha"
            size={"sm"}
          >
            Logs
          </Button> */}
        </HStack>
      </Flex>

      <SaveModal />
      <OpenModal />
    </Flex>
  );
}
