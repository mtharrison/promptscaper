"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  Flex,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Text,
  Tbody,
  Td,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { useAppStore } from "../../state";
import { useRef, useState, useEffect, RefObject } from "react";
import { loadAll } from "../../state/db";

import { SavedWorkspace } from "../../types";

export function SaveModal() {
  const { workspace, workspaceActions } = useAppStore();
  const [workspaces, setWorkspaces] = useState<SavedWorkspace[]>([]);

  const toast = useToast();

  const initialRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const all = await loadAll();
      setWorkspaces(all as any);
    };

    fetch();
  });

  return (
    <Modal
      size={"4xl"}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={workspace.saveModal.show}
      onClose={workspaceActions.hideSaveModal}
      colorScheme="blackAlpha"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save workspace</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex alignContent={"center"} alignItems={"center"}>
            <FormControl mb={5}>
              <FormLabel>New Name</FormLabel>
              <Input ref={initialRef} />
            </FormControl>
            <Button
              onClick={async () => {
                if (initialRef.current) {
                  await workspaceActions.save(initialRef.current.value);
                  toast({
                    position: "top",
                    size: "lg",
                    title: "Workspace saved",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                  });
                }
              }}
              colorScheme="blue"
              ml={5}
              mt={2}
              w={100}
            >
              Save
            </Button>
          </Flex>
          <Divider mb={3} />
          <TableContainer>
            <Text mb={3} textDecoration={"underline"}>
              Existing Workspaces
            </Text>
            <Table variant="unstyled" size={"sm"}>
              <Tbody>
                {workspaces
                  .sort((a, b) => b.ts - a.ts)
                  .map((w, i) => (
                    <Tr key={i}>
                      <Td p={0} py={4}>
                        <b>{w.name}</b>
                      </Td>
                      <Td p={0}>
                        last saved: {new Date(w.ts).toLocaleString()}
                      </Td>
                      <Td p={0} textAlign={"right"}>
                        <Button
                          onClick={async () => {
                            await workspaceActions.overwrite(w.id);
                            toast({
                              position: "top",
                              size: "lg",
                              title: "Workspace overwritten",
                              status: "success",
                              duration: 2000,
                              isClosable: true,
                            });
                          }}
                          colorScheme="red"
                          size={"sm"}
                        >
                          Overwrite
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  // return (
  //   <Modal
  //     initialFocusRef={initialRef}
  //     finalFocusRef={finalRef}
  //     isOpen={workspace.saveModal.show}
  //     onClose={workspaceActions.hideSaveModal}
  //     size={"2xl"}
  //   >
  //     <ModalOverlay />
  //     <ModalContent>
  //       <ModalHeader>Save workspace</ModalHeader>
  //       <ModalCloseButton />
  //       <ModalBody pb={6}>
  //         <FormControl>
  //           <FormLabel>Name</FormLabel>
  //           <Input ref={initialRef} />
  //         </FormControl>
  //       </ModalBody>

  //       <ModalFooter>
  //         <Button
  //           onClick={() => {
  //             initialRef.current &&
  //               workspaceActions.save(initialRef.current.value);
  //           }}
  //           colorScheme="blue"
  //           mr={3}
  //         >
  //           Save
  //         </Button>
  //         <Button onClick={workspaceActions.hideSaveModal}>Cancel</Button>
  //       </ModalFooter>
  //     </ModalContent>
  //   </Modal>
  // );
}
