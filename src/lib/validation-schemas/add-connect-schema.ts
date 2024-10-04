import { z } from "zod";

export const addConnectSchema = z.object({
  email: z.string().email(),
});
