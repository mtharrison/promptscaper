"use client";

import {
  Flex,
  Heading,
  Button,
  IconButton,
  Tooltip,
  Link,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { BiChevronDown } from "react-icons/bi";
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
  AiFillGithub,
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
        <Flex flex={"0 0 auto"} gap={3} alignItems={"center"}>
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
            <Menu>
              <MenuButton
                as={Button}
                size={"sm"}
                colorScheme="blackAlpha"
                rightIcon={<BiChevronDown />}
              >
                Workspace
              </MenuButton>
              <MenuList>
                <MenuItem onClick={newWorkspace} icon={<AiOutlinePlus />}>
                  New
                </MenuItem>
                <MenuItem onClick={showSaveModal} icon={<AiOutlineSave />}>
                  Save
                </MenuItem>
                <MenuItem
                  onClick={showOpenModal}
                  icon={<AiOutlineFolderOpen />}
                >
                  Open
                </MenuItem>
                <MenuItem onClick={exportWorkspace} icon={<BiExport />}>
                  Export
                </MenuItem>
                <MenuItem onClick={importWorkspace} icon={<BiImport />}>
                  Import
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <HStack bg="blackAlpha.100" p={2} rounded={"lg"} boxShadow={"sm"}>
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

        <Flex gap={3}>
          <HStack bg="blackAlpha.100" p={2} rounded={"lg"} boxShadow={"sm"}>
            <Button
              leftIcon={
                functionsVisible ? <AiFillEye /> : <AiFillEyeInvisible />
              }
              onClick={toggleFunctionsPanelVisibility}
              colorScheme="blackAlpha"
              size={"sm"}
            >
              Toggle Functions
            </Button>

            <Button
              leftIcon={configVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
              onClick={toggleConfigPanelVisibility}
              colorScheme="blackAlpha"
              size={"sm"}
            >
              Toggle Options
            </Button>
          </HStack>
          <HStack bg="blackAlpha.100" p={2} rounded={"lg"} boxShadow={"sm"}>
            <Link href="https://github.com/mtharrison/promptscaper" isExternal>
              <IconButton
                aria-label="contribute"
                icon={<AiFillGithub />}
                colorScheme="blackAlpha"
                size={"sm"}
              />
            </Link>
          </HStack>
        </Flex>
      </Flex>

      <SaveModal />
      <OpenModal />
    </Flex>
  );
}
