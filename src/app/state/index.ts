"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import { ApplicationState, Application } from "../types";
import { v4 } from "uuid";

import ChatActions from "./actions/chat";
import FunctionsActions from "./actions/functions";
import OptionsActions from "./actions/options";
import WorkspaceActions from "./actions/workspace";

export const initialState: ApplicationState = {
  functions: {
    functions: "",
  },
  chat: {
    messages: [
      {
        id: v4(),
        content: "You are a helpful assistant",
        role: "system",
      },
    ],
    input: "",
    completionPending: false,
  },
  options: {
    llm: {
      storeApiKey: false,
      apiKey: "",
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1024,
    },
  },
  workspace: {
    dialog: {
      show: false,
      title: "",
      message: "",
      action: () => {},
      cancel: () => {},
    },
    saveModal: {
      show: false,
    },
    openModal: {
      show: false,
    },
    panels: {
      functions: { visible: true },
      config: { visible: true },
      logs: { visible: false },
    },
  },
};

export const useAppStore = create<Application>()(
  temporal((set, get) => ({
    ...initialState,
    chatActions: ChatActions(set, get),
    workspaceActions: WorkspaceActions(set, get),
    functionsActions: FunctionsActions(set),
    optionsActions: OptionsActions(set, get),
  }))
);
