"use client";

import {
  Heading,
  Text,
  Checkbox,
  Box,
  Flex,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Input,
  Alert,
  AlertStatus,
  AlertIcon,
} from "@chakra-ui/react";

import { useAppStore } from "../../state";
import { useEffect } from "react";

type PasswordControl = {
  type: "password";
  name: string;
  value: string;
  onChange: (value: string) => void;
};

type SelectControl = {
  type: "select";
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

type RangeControl = {
  type: "range";
  name: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

type NumberControl = {
  type: "number";
  name: string;
  value: number;
  onChange: (value: number) => void;
};

type TextareaControl = {
  type: "textarea";
  name: string;
  title: boolean;
  value: string;
  onChange: (value: string) => void;
};

type Control =
  | SelectControl
  | RangeControl
  | NumberControl
  | TextareaControl
  | PasswordControl;

function ControlItem({ control }: { control: Control }) {
  const storeApiKey = useAppStore((state) => state.options.llm.storeApiKey);
  const toggleStoreApiKey = useAppStore(
    (state) => state.optionsActions.toggleStoreApiKey
  );

  if (control.type === "select") {
    return (
      <Box flex="1 0 calc(50% - 10px)">
        <Heading size="xs" mb={2} textTransform="uppercase">
          {control.name}
        </Heading>
        <Select
          id={control.name}
          size={"sm"}
          onChange={(e) => control.onChange(e.target.value)}
          placeholder="Select option"
          value={control.value}
        >
          {control.options.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Box>
    );
  }

  if (control.type === "password") {
    return (
      <Box flex="1 0 calc(50% - 10px)">
        <Flex gap={4}>
          <Box flex={"2 0 0"}>
            <Heading size="xs" mb={2} textTransform="uppercase">
              {control.name}
            </Heading>
            <Input
              id={control.name}
              autoComplete="off"
              type="password"
              size={"sm"}
              isInvalid={control.value === ""}
              onChange={(e) => control.onChange(e.target.value)}
              value={control.value}
            />
          </Box>
          <Box flex={"1 1 0"}>
            <Heading size="xs" mb={2} textTransform="uppercase">
              Cache locally?
            </Heading>
            <Checkbox
              size={"sm"}
              isChecked={storeApiKey}
              onChange={toggleStoreApiKey}
            />
          </Box>
        </Flex>
      </Box>
    );
  }

  if (control.type === "range") {
    return (
      <Box flex="1 0 calc(50% - 10px)">
        <Heading size="xs" mb={2} textTransform="uppercase">
          {control.name}
        </Heading>
        <Slider
          id={control.name}
          aria-label="slider-ex-1"
          value={control.value}
          min={control.min}
          max={control.max}
          step={0.1}
          onChange={(e) => control.onChange(e)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>

          <SliderThumb />
        </Slider>
        <Text mt={1}>{control.value}</Text>
      </Box>
    );
  }

  if (control.type === "number") {
    return (
      <Box flex="1 0 calc(50% - 10px)">
        <Heading size="xs" mb={2} textTransform="uppercase">
          {control.name}
        </Heading>
        <NumberInput
          id={control.name}
          value={control.value}
          onChange={(e) => control.onChange(parseFloat(e))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
    );
  }

  if (control.type === "textarea") {
    return (
      <Box flex="1 0 calc(50% - 10px)">
        {control.title && (
          <Heading size="xs" mb={2} textTransform="uppercase">
            {control.name}
          </Heading>
        )}
        <Textarea
          id={control.name}
          size={"sm"}
          minH={200}
          defaultValue={"You are a helpful Assistant"}
        ></Textarea>
      </Box>
    );
  }
}

export function Options() {
  const {
    model,
    temperature,
    top_p,
    max_tokens,
    apiKey,
    frequency_penalty,
    presence_penalty,
    storeApiKey,
  } = useAppStore((state) => state.options.llm);

  const {
    updateApiKey,
    updateModel,
    updateTemperature,
    updateTopP,
    updateFrequencyPenalty,
    updatePresencePenalty,
    updateMaxTokens,
  } = useAppStore((state) => state.optionsActions);

  useEffect(() => {
    const cachedKey = sessionStorage.getItem("promptScaper-api-key");
    console.log(cachedKey);
    if (cachedKey) {
      updateApiKey(cachedKey);
    }
  }, []);

  const llmControls: Control[] = [
    {
      type: "password",
      name: "OpenAI API Key",
      value: apiKey,
      onChange: updateApiKey,
    },
    {
      type: "select",
      name: "model",
      options: ["gpt-4", "gpt-4-32k", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"],
      value: model,
      onChange: updateModel,
    },
    {
      type: "range",
      name: "temperature",
      min: 0,
      max: 2,
      value: temperature,
      onChange: updateTemperature,
    },
    {
      type: "range",
      name: "top_p",
      min: 0,
      max: 1,
      value: top_p,
      onChange: updateTopP,
    },
    {
      type: "range",
      name: "frequency_penalty",
      min: 0,
      max: 1,
      value: frequency_penalty,
      onChange: updateFrequencyPenalty,
    },
    {
      type: "range",
      name: "presence_penalty",
      min: 0,
      max: 1,
      value: presence_penalty,
      onChange: updatePresencePenalty,
    },
    {
      type: "number",
      name: "max_tokens",
      value: max_tokens,
      onChange: updateMaxTokens,
    },
  ];

  return (
    <Flex
      flexDirection={"column"}
      bg="white"
      flex={"1 0 auto"}
      overflow={"scroll"}
      rounded={"lg"}
      boxShadow={"md"}
    >
      {!apiKey && (
        <Alert status="error">
          <AlertIcon />
          <Text>
            Enter your <b>OpenAI API Key</b>. This will not be stored unless you
            choose to cache in local browser storage. When saving or exporting a
            workspace your API key always will be omitted from the saved data.
          </Text>
        </Alert>
      )}
      <Flex p={5} alignItems={"baseline"} justifyContent={"space-between"}>
        <Heading size="md">LLM Config</Heading>
      </Flex>
      <Flex p={5} gap={3} flexWrap={"wrap"}>
        {llmControls.map((c, i) => (
          <ControlItem key={i} control={c} />
        ))}
      </Flex>
    </Flex>
  );
}
