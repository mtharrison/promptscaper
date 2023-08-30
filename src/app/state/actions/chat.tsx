"use client";

import { ChatActions, Application, ChatMessage } from "@/app/types";
import { produce } from "immer";
import { v4 } from "uuid";
import OpenAI from "openai";

export default (
  set: (
    partial:
      | Application
      | Partial<Application>
      | ((state: Application) => Application | Partial<Application>),
    replace?: boolean | undefined
  ) => void,
  get: () => Application
): ChatActions => ({
  updateInput: (input: string) =>
    set(
      produce((state: Application) => {
        state.chat.input = input;
      })
    ),
  updateMessage: (msgId: string, content: string) =>
    set(
      produce((state: Application) => {
        const msg = state.chat.messages.find(({ id }) => id === msgId);
        if (msg?.content) {
          msg.content = content;
        }
      })
    ),
  deleteMessage: (delId: string) =>
    set(
      produce((state: Application) => {
        state.chat.messages = state.chat.messages.filter(
          ({ id }) => id !== delId
        );
      })
    ),
  rewindToMessage: (rewId: string) =>
    set(
      produce((state: Application) => {
        let stop = false;
        state.chat.messages = state.chat.messages.filter(({ id }) => {
          if (stop) {
            return false;
          }

          if (id === rewId) {
            stop = true;
          }

          return true;
        });
      })
    ),
  submitFunctionCallResponse: async (srcId: string, value: string) => {
    const name = get().chat.messages.find(({ id }) => srcId === id)
      ?.function_call.name as string;

    const newMessage: ChatMessage = {
      id: v4(),
      content: value,
      role: "function",
      name,
    };

    get().chatActions.sendMessage(newMessage);
  },
  sendMessage: async (newMessage?: ChatMessage | null) => {
    if (newMessage !== null) {
      if (newMessage === undefined) {
        newMessage = {
          id: v4(),
          content: get().chat.input,
          role: "user",
        } as ChatMessage;
      }

      set(({ chat }) => ({
        chat: {
          ...chat,
          messages: [...chat.messages, newMessage as ChatMessage],
          input: "",
          completionPending: true,
        },
      }));
    } else {
      set(
        produce((state: Application) => {
          state.chat.completionPending = true;
        })
      );
    }

    let functions;
    try {
      functions = JSON.parse(get().functions.functions);
    } catch (err) {
      functions = undefined;
    }

    const {
      apiKey,
      model,
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      max_tokens,
    } = get().options.llm;

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      messages: get().chat.messages.map(
        ({ role, content, function_call, name }) => ({
          role,
          content,
          function_call,
          name,
        })
      ),
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      max_tokens,
      functions,
      model,
    });

    const resMessage = completion.choices[0].message as ChatMessage;
    resMessage.id = v4();

    set(({ chat }) => ({
      chat: {
        ...chat,
        messages: [...chat.messages, resMessage],
        input: "",
        completionPending: false,
      },
    }));
  },
  play: () => {
    get().chatActions.sendMessage(null);
  },
});
