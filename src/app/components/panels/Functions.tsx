"use client";

import {
  Card,
  CardHeader,
  Heading,
  Text,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useAppStore } from "../../state";
import Editor from "@monaco-editor/react";

export function Functions() {
  const { functions, functionsActions } = useAppStore();

  return (
    <Flex
      flexDirection={"column"}
      gap={5}
      flex={"1 1 0"}
      bg="#1E1E1E"
      overflow={"scroll"}
      rounded={"lg"}
      boxShadow={"md"}
    >
      <Flex p={5} alignItems={"baseline"} justifyContent={"space-between"}>
        <Heading fontFamily={"mono"} color="white" size="md">
          &gt;_ Functions Editor
        </Heading>
        <Button
          onClick={functionsActions.addExample}
          size={"sm"}
          colorScheme="orange"
        >
          Add example function
        </Button>
      </Flex>
      <Editor
        defaultLanguage="json"
        options={{
          lineNumbers: "on",
          formatOnPaste: true,
          formatOnType: true,
          fontSize: 16,
          tabSize: 2,
          scrollBeyondLastLine: false,
          wrappingStrategy: "simple",
          minimap: {
            enabled: false,
          },
        }}
        onChange={(newText: string | undefined) => {
          if (newText) {
            functionsActions.update(newText);
          }
        }}
        value={functions.functions}
        theme="vs-dark"
      />
    </Flex>
  );
}
