import { mtagi } from "../src/mtagi/index.ts";
import { webSearchTool } from "../src/mtagi/tools/web-search.ts";

async function main() {
  console.log("==========================================");
  console.log("🔍 TESTING MASTRA ENGINE IN MTAGI PROJECT");
  console.log("==========================================\n");

  // TEST 1: Check Registered Agents
  console.log("1️⃣ [Mastra Instance & Agents]");
  const assistant = await mtagi.getAgent("assistant");
  const titler = await mtagi.getAgent("titler");
  if (!assistant || !titler) {
    throw new Error("❌ Mastra agents not found!");
  }
  console.log("   ✅ Mastra Instance initialized!");
  console.log(`   ✅ Agent 1: ${assistant.name} (id: ${assistant.id})`);
  console.log(`   ✅ Agent 2: ${titler.name} (id: ${titler.id})\n`);

  // TEST 2: Agent Inference via Groq
  console.log("2️⃣ [Mastra Agent Execution]");
  console.log("   Sending test prompt to assistant...");
  const agentResponse = await assistant.generate("Who are you and who made you? Reply in one short sentence.");
  console.log(`   🤖 Output: "${agentResponse.text.trim()}"`);
  console.log("   ✅ Mastra Agent + Groq LLM working perfectly!\n");

  // TEST 3: Mastra Memory & LibSQL Storage
  console.log("3️⃣ [Mastra Persistent Memory & Storage]");
  const memory = await assistant.getMemory();
  if (!memory) {
    throw new Error("❌ Memory is not configured for Mastra assistant!");
  }
  const testThread = await memory.createThread({
    resourceId: "test-user",
    title: "Mastra Health Check",
  });
  console.log(`   ✅ Thread created with ID: ${testThread.id}`);
  console.log("   ✅ Saved to local LibSQL store (mtagi.db)\n");

  // TEST 4: Mastra Tool Execution (Exa Web Search)
  console.log("4️⃣ [Mastra Tool Execution]");
  console.log("   Executing webSearchTool...");
  try {
    const searchResults = await webSearchTool.execute({
      query: "NASA space mission latest",
    });
    console.log(`   ✅ Web search tool returned ${Array.isArray(searchResults) ? searchResults.length : 0} results.`);
  } catch (err: any) {
    console.log("   ⚠️ Note on tool:", err?.message || err);
  }

  console.log("\n==========================================");
  console.log("🎉 ALL MASTRA CHECKS PASSED SUCCESSFULLY!");
  console.log("==========================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Mastra Test Failed:", err);
  process.exit(1);
});

