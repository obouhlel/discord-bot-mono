export interface CommandAPIResponse {
  type: "slash" | "message";
  name: string;
  description: string;
  options?: unknown[];
  aliases?: string[];
}

export interface CommandsAPIData {
  slash: CommandAPIResponse[];
  message: CommandAPIResponse[];
  total: number;
}

export interface CommandStats {
  slashCommands: number;
  messageCommands: number;
  total: number;
  commands: {
    slash: string[];
    message: string[];
  };
}

export interface SerializedCommandData {
  name: string;
  description?: string;
  options?: unknown[];
  type?: number;
}

// Moved to @shared/types/api.ts
export type { DatabaseStatusResponse } from "@shared/types/api";
