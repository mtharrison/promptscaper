"use client";

import {
  Badge,
  IconButton,
  Tooltip,
  Flex,
  Box,
  Heading,
  Text,
  ButtonGroup,
  Tag,
  TagLabel,
  Textarea,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Button,
} from "@chakra-ui/react";

import _ from "lodash";

import {
  AiOutlineUser,
  AiOutlineRobot,
  AiOutlineLaptop,
  AiOutlineCode,
} from "react-icons/ai";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { useAppStore } from "../../../state";
import { ChatMessage } from "../../../types";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

function messageColor(role: string) {
  if (role === "user") {
    return "teal";
  }

  if (role === "function") {
    return "blue";
  }

  if (role === "assistant") {
    return "purple";
  }

  return "orange";
}

function messageIcon(role: string) {
  if (role === "user") {
    return <AiOutlineUser fontSize="1.5rem" />;
  }

  if (role === "assistant") {
    return <AiOutlineRobot fontSize="1.5rem" />;
  }

  if (role === "function") {
    return <AiOutlineCode fontSize="1.5rem" />;
  }

  return <AiOutlineLaptop fontSize="1.5rem" />;
}

function formatFunctionCall(call: any) {
  const name = call.name;
  const args = JSON.parse(call.arguments);
  return `\`\`\`json\n${JSON.stringify({ name, args }, null, 2)}\n\`\`\``;
}

function renderAvatarForMessage(message: ChatMessage) {
  return (
    <Tag
      size="md"
      bg={messageColor(message.role)}
      color="white"
      borderRadius="full"
      position={"absolute"}
      left={"0px"}
      top={"-20px"}
    >
      <Avatar
        size={"sm"}
        bg={messageColor(message.role)}
        icon={messageIcon(message.role)}
      />
      <TagLabel px={2}>
        {message.function_call
          ? "Function Call"
          : message.name
          ? "Function Response"
          : _.startCase(message.role)}
      </TagLabel>
    </Tag>
  );
}

export function Message({
  message,
  index,
}: {
  message: ChatMessage;
  index: number;
}) {
  const { chatActions } = useAppStore();
  const { pause, resume } = useAppStore.temporal.getState();
  const {
    updateMessage,
    rewindToMessage,
    deleteMessage,
    submitFunctionCallResponse,
  } = chatActions;

  const [editing, setEditing] = useState<boolean>(false);
  const [showReturnValueTextArea, setShowReturnValueTextArea] =
    useState<boolean>(false);
  const [returnValue, setReturnValue] = useState<string>("");
  const [editedText, setEditedText] = useState<string>(message.content);
  const textareaRef = useRef(null);

  useEffect(() => {
    setEditedText(message.content);
  }, [message.content]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      const el = textareaRef.current as HTMLTextAreaElement;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  const maybeSetEditing = useCallback((event: MouseEvent) => {
    if (event.detail === 2) {
      pause();
      setEditing(true);
    }
  }, []);

  const finishEditing = useCallback(() => {
    setEditing(false);
    resume();
    if (message.content !== editedText) {
      updateMessage(message.id, editedText);
    }
  }, [editedText, message.content]);

  return (
    <Flex flexDirection={"row"} gap={3}>
      <Flex
        flex={1}
        flexDirection={"column"}
        px={5}
        pt={7}
        pb={5}
        bg={messageColor(message.role) + ".50"}
        borderColor={messageColor(message.role)}
        borderTopWidth={"5px"}
        roundedTop={"md"}
        position={"relative"}
      >
        <Tooltip label={message.role} aria-label={message.role}>
          {renderAvatarForMessage(message)}
        </Tooltip>
        {editing ? (
          <Textarea
            bg={"white"}
            ref={textareaRef}
            id={`input-textarea-index-${index}`}
            onBlur={finishEditing}
            height={"max-content"}
            onChange={(e) => setEditedText(e.target.value)}
            value={editedText}
          ></Textarea>
        ) : (
          <Box onClick={maybeSetEditing}>
            <ReactMarkdown
              className="message-markdown"
              children={
                message.function_call
                  ? formatFunctionCall(message.function_call)
                  : message.content
              }
            ></ReactMarkdown>
          </Box>
        )}
        {message.function_call && index === 0 && (
          <>
            {!showReturnValueTextArea && (
              <Button
                leftIcon={<AiOutlineCode />}
                w={"min-content"}
                mt={5}
                onClick={() => setShowReturnValueTextArea(true)}
                colorScheme="purple"
              >
                Set return value
              </Button>
            )}
            {showReturnValueTextArea && (
              <>
                <Textarea
                  mt={5}
                  placeholder="enter return value"
                  id={`return-textarea-index-${index}`}
                  value={returnValue}
                  onChange={(e) => setReturnValue(e.target.value)}
                ></Textarea>
                <Flex gap={3}>
                  <Button
                    w={"min-content"}
                    mt={5}
                    colorScheme="purple"
                    onClick={() => {
                      submitFunctionCallResponse(message.id, returnValue);
                      setShowReturnValueTextArea(false);
                      setReturnValue("");
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    w={"min-content"}
                    mt={5}
                    colorScheme="purple"
                    variant={"outline"}
                    onClick={() => setShowReturnValueTextArea(false)}
                  >
                    Cancel
                  </Button>
                </Flex>
              </>
            )}
          </>
        )}
      </Flex>
      <Flex
        flex={"0"}
        placeSelf={"flex-start"}
        gap={2}
        flexDirection={"column"}
        bg="blackAlpha.100"
        p={2}
        rounded={"lg"}
        boxShadow={"sm"}
      >
        <Tooltip label="Delete message" aria-label="Delete message">
          <IconButton
            colorScheme="red"
            id={`delete-message-index-${index}`}
            size={"sm"}
            icon={<TiDelete />}
            aria-label="Delete message"
            onClick={() => deleteMessage(message.id)}
          />
        </Tooltip>

        <Tooltip
          label="Delete all messages after this"
          aria-label="Delete all messages after this"
        >
          <IconButton
            colorScheme="blackAlpha"
            hidden={index === 0}
            icon={<RiDeleteBack2Fill />}
            aria-label="xxx"
            size={"sm"}
            onClick={() => rewindToMessage(message.id)}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
