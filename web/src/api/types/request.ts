// Extend Request type for Bun server with params
export interface BunRequest extends Request {
  params: Record<string, string>;
}
