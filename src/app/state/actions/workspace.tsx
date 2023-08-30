"use client";

import { Application, WorkspaceActions } from "@/app/types";
import { produce } from "immer";
import { v4 } from "uuid";
import { load, save, remove } from "../db";
import { pick, omit, defaultsDeep } from "lodash";
import { initialState } from "..";

const savedKeys = ["chat", "options", "workspace", "functions"];
const omitKeys = ["options.llm.apiKey", "options.llm.storeApiKey"];

export default (
  set: (
    partial:
      | Application
      | Partial<Application>
      | ((state: Application) => Application | Partial<Application>),
    replace?: boolean | undefined
  ) => void,
  get: () => Application
): WorkspaceActions => ({
  showSaveModal: () =>
    set(
      produce((state: Application) => {
        state.workspace.saveModal.show = true;
      })
    ),
  hideSaveModal: () =>
    set(
      produce((state: Application) => {
        state.workspace.saveModal.show = false;
      })
    ),
  showOpenModal: () =>
    set(
      produce((state: Application) => {
        state.workspace.openModal.show = true;
      })
    ),
  hideOpenModal: () =>
    set(
      produce((state: Application) => {
        state.workspace.openModal.show = false;
      })
    ),
  save: async (name: string) => {
    get().workspaceActions.hideSaveModal();
    const s = omit(pick(get(), savedKeys), omitKeys);
    await save({
      id: v4(),
      state: JSON.stringify(s),
      name,
      ts: Date.now(),
    });
  },
  overwrite: async (id: string) => {
    get().workspaceActions.hideSaveModal();
    const s = omit(pick(get(), savedKeys), omitKeys);
    const item = await load(id);
    await save({
      id,
      state: JSON.stringify(s),
      name: item.name,
      ts: Date.now(),
    });
  },
  open: async (id: string) => {
    get().workspaceActions.hideOpenModal();
    const item = await load(id);
    //@ts-ignore
    const savedState = JSON.parse(item.state) as Partial<Application>;
    set((state) => defaultsDeep(savedState, state));
  },
  remove: async (id: string) => {
    await remove(id);
  },
  newWorkspace: () => {
    set(({ workspace }) => {
      return {
        workspace: {
          ...workspace,
          dialog: {
            show: true,
            title: "Create new workspace",
            message:
              "You will lose all unsaved changes, are you sure you want to continue?",
            action: () => {
              set(({ workspace }) => ({
                ...initialState,
                workspace: {
                  ...workspace,
                  dialog: {
                    ...workspace.dialog,
                    show: false,
                  },
                },
              }));
            },
            cancel: () => {
              set(({ workspace }) => ({
                workspace: {
                  ...workspace,
                  dialog: {
                    ...workspace.dialog,
                    show: false,
                  },
                },
              }));
            },
          },
        },
      };
    });
  },
  toggleFunctionsPanelVisibility: () =>
    set(
      produce((state) => {
        state.workspace.panels.functions.visible =
          !state.workspace.panels.functions.visible;
      })
    ),
  toggleConfigPanelVisibility: () =>
    set(
      produce((state) => {
        state.workspace.panels.config.visible =
          !state.workspace.panels.config.visible;
      })
    ),
  toggleLogsPanelVisibility: () =>
    set(
      produce((state) => {
        state.workspace.panels.logs.visible =
          !state.workspace.panels.logs.visible;
      })
    ),
  exportWorkspace: () => {
    if (typeof document === "undefined") {
      return;
    }
    const filename = `prompscaper-${Date.now()}.json`;
    const s = omit(pick(get(), savedKeys), omitKeys);
    const json = JSON.stringify(s);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("download", filename);
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
  importWorkspace: async () => {
    const pickerOpts = {
      types: [
        {
          description: "json",
          accept: {
            "text/*": [".json"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };
    //@ts-ignore
    const handle = await window.showOpenFilePicker(pickerOpts);
    const file = await handle[0].getFile();
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        const savedState = JSON.parse(
          reader.result as string
        ) as Partial<Application>;
        set((state) => ({ ...state, ...savedState }));
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  },
});
