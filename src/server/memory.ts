import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type WorkingMemory, workingMemorySchema } from "@/config/working-memory";
import { mtagi } from "@/mtagi";

const RESOURCE_ID = "user-id";

export const getWorkingMemory = createServerFn({ method: "GET" }).handler(async () => {
  const memory = await mtagi.getAgent("assistant").getMemory();

  if (!memory) {
    return { workingMemory: null as WorkingMemory | null };
  }

  const raw = await memory.getWorkingMemory({
    threadId: "",
    resourceId: RESOURCE_ID,
  });

  if (!raw) {
    return { workingMemory: null as WorkingMemory | null };
  }

  try {
    const parsed = workingMemorySchema.parse(JSON.parse(raw));
    return { workingMemory: parsed };
  } catch {
    return { workingMemory: null as WorkingMemory | null };
  }
});

export const updateWorkingMemory = createServerFn({ method: "POST" })
  .inputValidator(workingMemorySchema)
  .handler(async ({ data }) => {
    const memory = await mtagi.getAgent("assistant").getMemory();

    if (!memory) {
      throw new Error("Memory not available");
    }

    await memory.updateWorkingMemory({
      threadId: "",
      resourceId: RESOURCE_ID,
      workingMemory: JSON.stringify(data),
    });

    return { success: true };
  });

export const workingMemoryQueryOptions = queryOptions({
  queryKey: ["working-memory"],
  queryFn: () => getWorkingMemory(),
});
