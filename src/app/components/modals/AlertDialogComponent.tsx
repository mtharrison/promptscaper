"use client";

import {
  AlertDialog,
  Button,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";

import { useRef } from "react";

interface AlertDialogComponentProps {
  title: string;
  message: string;
  action: Function;
  cancel: Function;
  show: boolean;
}

export function AlertDialogComponent(props: AlertDialogComponentProps) {
  const { title, message, action, cancel, show } = props;
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <AlertDialog
        size={"xl"}
        isOpen={show}
        leastDestructiveRef={cancelRef}
        onClose={() => cancel()}
        colorScheme="blackAlpha"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{message}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => cancel()}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => action()} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
