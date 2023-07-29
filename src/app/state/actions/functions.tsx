import { Application, FunctionsActions } from "@/app/types";
import { produce } from "immer";

const exampleFunction = `[
  {
    "name": "get_current_weather",
    "description": "Get the current weather in a given location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The city and state, e.g. San Francisco, CA"
        },
        "unit": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"]
        }
      },
      "required": ["location"]
    }
  }
]`;

export default (
  set: (
    partial:
      | Application
      | Partial<Application>
      | ((state: Application) => Application | Partial<Application>),
    replace?: boolean | undefined
  ) => void
): FunctionsActions => ({
  update: (text: string) => {
    set(
      produce((state) => {
        state.functions.functions = text;
      })
    );
  },
  addExample: () =>
    set(
      produce((state) => {
        state.functions.functions = exampleFunction;
      })
    ),
});
