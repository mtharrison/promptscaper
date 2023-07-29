import { OptionsActions, Application } from "@/app/types";
import { produce } from "immer";

export default (
  set: (
    partial:
      | Application
      | Partial<Application>
      | ((state: Application) => Application | Partial<Application>),
    replace?: boolean | undefined
  ) => void,
  get: () => Application
): OptionsActions => ({
  updateApiKey: (input: string) =>
    set(
      produce((state: Application) => {
        state.options.llm.apiKey = input;
      })
    ),
  updateModel: (input: string) =>
    set(
      produce((state: Application) => {
        state.options.llm.model = input;
      })
    ),
  updateTemperature: (input: number) =>
    set(
      produce((state: Application) => {
        state.options.llm.temperature = input;
      })
    ),
  updateTopP: (input: number) =>
    set(
      produce((state: Application) => {
        state.options.llm.top_p = input;
      })
    ),
  updateFrequencyPenalty: (input: number) =>
    set(
      produce((state: Application) => {
        state.options.llm.frequency_penalty = input;
      })
    ),
  updatePresencePenalty: (input: number) =>
    set(
      produce((state: Application) => {
        state.options.llm.presence_penalty = input;
      })
    ),
  updateMaxTokens: (input: number) =>
    set(
      produce((state: Application) => {
        state.options.llm.max_tokens = input;
      })
    ),
});
