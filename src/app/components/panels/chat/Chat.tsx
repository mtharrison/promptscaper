"use client";

import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Flex,
  Input,
  FormControl,
  Tooltip,
  Divider,
  Progress,
} from "@chakra-ui/react";

// Chat
import {
  AiOutlineSend,
  AiFillCaretRight,
  AiOutlineUser,
  AiOutlineCode,
  AiOutlinePlayCircle,
  AiOutlinePlaySquare,
} from "react-icons/ai";
import { useAppStore } from "../../../state";
import { Message } from "./Message";

export function Chat() {
  const { messages, input, completionPending } = useAppStore(
    (state) => state.chat
  );
  const apiKey = useAppStore((state) => state.options.llm.apiKey);
  const { updateInput, sendMessage, play } = useAppStore(
    (state) => state.chatActions
  );
  const { pause, resume } = useAppStore.temporal.getState();

  const messageToSend = input.length > 0;

  return (
    <Flex
      p={5}
      flex={"2 0 50%"}
      flexDirection={"column"}
      rounded={"lg"}
      gap={5}
      bg={"white"}
      boxShadow={"md"}
    >
      <Flex flexDirection={"column"} flex={"1 1 auto"}>
        <Flex
          flexDirection={"column-reverse"}
          overflow={"scroll"}
          flex={"1 1 auto"}
          flexBasis={"0"}
          gap={6}
        >
          {completionPending && <Progress size="xs" isIndeterminate />}
          {messages
            .slice()
            .reverse()
            .map((message, i) => (
              <Message key={i} index={i} message={message} />
            ))}
        </Flex>
      </Flex>
      <Flex
        flex={"0 0 auto"}
        height={"60px"}
        width={"100%"}
        overflow={"scroll"}
        alignItems={"center"}
        gap={3}
      >
        <Box
          border="1px"
          borderColor="gray.200"
          flex={"1 0 auto"}
          bg={"gray.100"}
          height={"60px"}
          rounded={"md"}
          overflow={"hidden"}
        >
          <FormControl>
            <Input
              isDisabled={completionPending || !apiKey}
              rounded={"md"}
              overflow={"hidden"}
              autoComplete="new-password"
              height={"58px"}
              onChange={(e) => {
                pause();
                updateInput(e.target.value);
                resume();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              value={input}
              type="text"
              placeholder="Type a user message"
            />
          </FormControl>
        </Box>

        <Tooltip
          label={
            messageToSend
              ? "Send user message"
              : "Prompt LLM completion with no new message"
          }
          aria-label={
            messageToSend
              ? "Send user message"
              : "Prompt LLM completion with no new message"
          }
        >
          <IconButton
            flex={"0 0 auto"}
            isDisabled={completionPending || !apiKey}
            icon={messageToSend ? <AiOutlineSend /> : <AiOutlinePlaySquare />}
            aria-label="send"
            height={"100%"}
            width={"100px"}
            colorScheme={messageToSend ? "blue" : "green"}
            onClick={() => (messageToSend ? sendMessage() : play())}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
