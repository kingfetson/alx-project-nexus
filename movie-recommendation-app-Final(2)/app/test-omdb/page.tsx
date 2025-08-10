import { NextResponse } from "next/server";

const API_URL = process.env.OMDB_API_URL || "https://www.omdbapi.com/";
const API_KEY = process.env.OMDB_API_KEY || "";

interface TestDefinition {
  test: string;
  params?: Record<string, string | undefined>;
}

interface TestResult {
  test: string;
  status: number | string;
  success: boolean;
  error: string | null;
  resultCount: number;
  sampleData: {
    Title?: string;
    Year?: string;
    Type?: string;
  } | null;
}

interface ApiTestResponse {
  apiKey: string;
  apiUrl: string;
  testResults: TestResult[];
  summary: {
    successful: number;
    total: number;
    successRate: string;
    status: string;
  };
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "OMDb API key is not set in environment variables" },
      { status: 500 }
    );
  }

  const testsToRun: TestDefinition[] = [
    { test: "Search Movies by Title", params: { s: "Inception" } },
    { test: "Search Series by Title", params: { s: "Breaking Bad", type: "series" } },
    { test: "Get Movie by IMDb ID", params: { i: "tt1375666" } },
    { test: "Search Non-existent Movie", params: { s: "asdkjasdkjasd" } },
  ];

  // Helper to run one test
  const runTest = async (test: TestDefinition): Promise<TestResult> => {
    try {
      const paramsObject: Record<string, string> = {
        apikey: API_KEY,
        ...(test.params || {}),
      };

      const searchParams = new URLSearchParams(paramsObject);
      const response = await fetch(`${API_URL}?${searchParams.toString()}`);
      const data = await response.json();

      const success = response.ok && data.Response === "True";

      return {
        test: test.test,
        status: response.status,
        success,
        error: success ? null : data.Error || "Unknown error",
        resultCount: success
          ? data.Search
            ? data.Search.length
            : data.Title
              ? 1
              : 0
          : 0,
        sampleData: success
          ? data.Search
            ? {
                Title: data.Search[0]?.Title,
                Year: data.Search[0]?.Year,
                Type: data.Search[0]?.Type,
              }
            : {
                Title: data.Title,
                Year: data.Year,
                Type: data.Type,
              }
          : null,
      };
    } catch (err) {
      return {
        test: test.test,
        status: "Network Error",
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        resultCount: 0,
        sampleData: null,
      };
    }
  };

  // Run all tests in parallel
  const results = await Promise.all(testsToRun.map(runTest));

  // Summary
  const successful = results.filter((r) => r.success).length;
  const total = results.length;
  const successRate = ((successful / total) * 100).toFixed(1) + "%";
  const status =
    successful === total
      ? "All tests passed"
      : successful > 0
        ? "Some tests passed"
        : "All tests failed";

  const responsePayload: ApiTestResponse = {
    apiKey: API_KEY,
    apiUrl: API_URL,
    testResults: results,
    summary: {
      successful,
      total,
      successRate,
      status,
    },
  };

  return NextResponse.json(responsePayload);
}
