import type { TextChannel } from "discord.js";
import type { MessageCommandContext } from "../../types/commands/message.type";
import { MessageCommand } from "../../types/commands/message.type";

export default class PingCommand extends MessageCommand {
  public readonly data = {
    name: "ping",
    description: "Reply pong message if the message is ping",
  };

  shouldExecute({ message }: MessageCommandContext): boolean {
    return message.content.toLowerCase() === "ping";
  }

  async execute({ message }: MessageCommandContext): Promise<void> {
    const channel = message.channel as TextChannel;
    await channel.send("pong");
  }
}
