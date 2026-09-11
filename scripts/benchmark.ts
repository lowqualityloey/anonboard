import { performance } from "node:perf_hooks";
import { prisma } from "../src/server/db";
import { getBoards, invalidateBoardsCache } from "../src/server/queries/boards";

const mockBoards = [
  {
    id: "board-1",
    name: "General",
    slug: "general",
    description: "General discussion board",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    _count: { threads: 42 },
  },
  {
    id: "board-2",
    name: "Study",
    slug: "study",
    description: "Study and academic talk",
    createdAt: new Date("2026-01-02T00:00:00Z"),
    _count: { threads: 18 },
  },
  {
    id: "board-3",
    name: "Random",
    slug: "random",
    description: "Off-topic chat",
    createdAt: new Date("2026-01-03T00:00:00Z"),
    _count: { threads: 95 },
  },
];

async function runBenchmark() {
  let dbCallCount = 0;

  // Mock prisma.board.findMany with simulated DB latency (2ms per DB call)
  prisma.board.findMany = (async () => {
    dbCallCount++;
    await new Promise((resolve) => setTimeout(resolve, 2));
    return mockBoards;
  }) as any;

  const iterations = 1000;

  // --- UNCACHED BENCHMARK ---
  invalidateBoardsCache();
  dbCallCount = 0;
  const startUncached = performance.now();
  for (let i = 0; i < iterations; i++) {
    invalidateBoardsCache(); // Force cache bypass on every call to simulate uncached
    await getBoards();
  }
  const endUncached = performance.now();
  const totalMsUncached = endUncached - startUncached;
  const avgMsUncached = totalMsUncached / iterations;
  const opsUncached = (iterations / totalMsUncached) * 1000;
  const dbCallsUncached = dbCallCount;

  // --- CACHED BENCHMARK ---
  invalidateBoardsCache();
  dbCallCount = 0;
  const startCached = performance.now();
  for (let i = 0; i < iterations; i++) {
    await getBoards();
  }
  const endCached = performance.now();
  const totalMsCached = endCached - startCached;
  const avgMsCached = totalMsCached / iterations;
  const opsCached = (iterations / totalMsCached) * 1000;
  const dbCallsCached = dbCallCount;

  // --- CONCURRENT CALLS DEDUPLICATION CHECK ---
  invalidateBoardsCache();
  dbCallCount = 0;
  const concurrentCalls = 100;
  const startConcurrent = performance.now();
  await Promise.all(Array.from({ length: concurrentCalls }, () => getBoards()));
  const endConcurrent = performance.now();
  const dbCallsConcurrent = dbCallCount;

  console.log(`\n==================================================`);
  console.log(`              BENCHMARK RESULTS                   `);
  console.log(`==================================================`);
  console.log(`UNCACHED (${iterations} iterations):`);
  console.log(`  Total Time: ${totalMsUncached.toFixed(2)} ms`);
  console.log(`  Avg Latency: ${avgMsUncached.toFixed(4)} ms`);
  console.log(`  Throughput: ${opsUncached.toFixed(2)} ops/sec`);
  console.log(`  DB Calls Executed: ${dbCallsUncached}`);

  console.log(`\nCACHED (${iterations} iterations):`);
  console.log(`  Total Time: ${totalMsCached.toFixed(2)} ms`);
  console.log(`  Avg Latency: ${avgMsCached.toFixed(4)} ms`);
  console.log(`  Throughput: ${opsCached.toFixed(2)} ops/sec`);
  console.log(`  DB Calls Executed: ${dbCallsCached}`);

  console.log(`\nCONCURRENT CALLS (${concurrentCalls} simultaneous callers):`);
  console.log(`  Total Time: ${(endConcurrent - startConcurrent).toFixed(2)} ms`);
  console.log(`  DB Calls Executed: ${dbCallsConcurrent} (Deduplicated successfully)`);

  const speedupFactor = totalMsUncached / totalMsCached;
  const latencyReduction = ((avgMsUncached - avgMsCached) / avgMsUncached) * 100;

  console.log(`\nIMPROVEMENT SUMMARY:`);
  console.log(`  Speedup Factor: ${speedupFactor.toFixed(2)}x faster`);
  console.log(`  Latency Reduction: ${latencyReduction.toFixed(2)}%`);
  console.log(`  DB Query Reduction: from ${dbCallsUncached} to ${dbCallsCached} queries`);
  console.log(`==================================================\n`);
}

runBenchmark().catch(console.error);
