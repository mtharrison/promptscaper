export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system" | "function";
  function_call?: any;
  name?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  input: string;
  completionPending: boolean;
}

export interface FunctionsState {
  functions: string;
}

export interface WorkspaceState {
  dialog: {
    show: boolean;
    title: string;
    message: string;
    action: Function;
    cancel: Function;
  };
  saveModal: {
    show: boolean;
  };
  openModal: {
    show: boolean;
  };
  panels: {
    functions: { visible: boolean };
    config: { visible: boolean };
    logs: { visible: boolean };
  };
}

export interface OptionsState {
  llm: {
    storeApiKey: boolean;
    apiKey: string;
    model: string;
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    max_tokens: number;
  };
}

export interface ApplicationState {
  chat: ChatState;
  workspace: WorkspaceState;
  options: OptionsState;
  functions: FunctionsState;
}

// actions

export interface ChatActions {
  updateInput: (input: string) => void;
  sendMessage: (message?: ChatMessage | null) => void;
  updateMessage: (id: string, content: string) => void;
  rewindToMessage: (id: string) => void;
  deleteMessage: (id: string) => void;
  submitFunctionCallResponse: (id: string, value: string) => void;
  play: () => void;
}

export interface OptionsActions {
  toggleStoreApiKey: () => void;
  updateApiKey: (input: string) => void;
  updateModel: (input: string) => void;
  updateTemperature: (input: number) => void;
  updateTopP: (input: number) => void;
  updateFrequencyPenalty: (input: number) => void;
  updatePresencePenalty: (input: number) => void;
  updateMaxTokens: (input: number) => void;
}

export interface WorkspaceActions {
  newWorkspace: () => void;
  showSaveModal: () => void;
  hideSaveModal: () => void;
  showOpenModal: () => void;
  hideOpenModal: () => void;
  save: (name: string) => void;
  overwrite: (id: string) => void;
  open: (id: string) => void;
  remove: (id: string) => void;
  toggleFunctionsPanelVisibility: () => void;
  toggleConfigPanelVisibility: () => void;
  toggleLogsPanelVisibility: () => void;
  exportWorkspace: () => void;
  importWorkspace: () => void;
}

export interface FunctionsActions {
  update: (text: string) => void;
  addExample: () => void;
}

export interface ApplicationActions {
  chatActions: ChatActions;
  optionsActions: OptionsActions;
  workspaceActions: WorkspaceActions;
  functionsActions: FunctionsActions;
}

export interface SavedWorkspace {
  id: string;
  name: string;
  state: string;
  ts: number;
}

export type Application = ApplicationState & ApplicationActions;
