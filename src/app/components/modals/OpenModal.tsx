"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Button,
  Table,
  TableContainer,
  Tr,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { useAppStore } from "../../state";
import { useEffect, useRef, useState } from "react";

import { loadAll } from "../../state/db";
import { SavedWorkspace } from "../../types";

export function OpenModal() {
  const { workspace, workspaceActions } = useAppStore();
  const [workspaces, setWorkspaces] = useState<SavedWorkspace[]>([]);

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
      isOpen={workspace.openModal.show}
      onClose={workspaceActions.hideOpenModal}
      colorScheme="blackAlpha"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Open workspace</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <TableContainer>
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
                      <Td p={0} textAlign="right">
                        <Button
                          onClick={() => workspaceActions.open(w.id)}
                          colorScheme="blue"
                          size={"sm"}
                          mr={3}
                        >
                          Open
                        </Button>
                        <Button
                          onClick={() => workspaceActions.remove(w.id)}
                          colorScheme="red"
                          size={"sm"}
                        >
                          Delete
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
}
