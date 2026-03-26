import { describe, expect, it } from "vitest";
import {
  buildSearchTasks,
  classifyBrandSignal,
  csvStringify,
  parseBrandList,
  summarizeBrand,
  summarizeForCsv,
  type PageScanResult,
} from "./naver-shortform-signals.ts";

describe("buildSearchTasks", () => {
  it("creates current and historical search tasks", () => {
    const tasks = buildSearchTasks("닥터지");
    expect(tasks).toHaveLength(6);
    expect(tasks[0]?.bucket).toBe("current");
    expect(tasks[3]?.bucket).toBe("historical");
    expect(tasks[1]?.url).toContain(encodeURIComponent("닥터지 클립"));
  });
});

describe("parseBrandList", () => {
  it("parses txt brand lists", () => {
    expect(parseBrandList("닥터지\n아몬즈\n\n닥터지\n")).toEqual(["닥터지", "아몬즈"]);
  });

  it("parses csv brand lists by column name", () => {
    const raw = ["id,brand", '1,"닥터지"', "2,아몬즈"].join("\n");
    expect(parseBrandList(raw, "brand")).toEqual(["닥터지", "아몬즈"]);
  });
});

describe("classifyBrandSignal", () => {
  it("marks strong stop suspects when historical signals remain and current is gone", () => {
    expect(
      classifyBrandSignal({
        currentScore: 0,
        historicalScore: 7,
        currentCategories: [],
        historicalEvidenceCount: 1,
        historicalLinkCount: 1,
      }),
    ).toEqual({
      status: "stopped_suspect_strong",
      confidence: "high",
    });
  });

  it("marks active when current direct signals exist", () => {
    expect(
      classifyBrandSignal({
        currentScore: 5,
        historicalScore: 2,
        currentCategories: ["clip"],
        historicalEvidenceCount: 0,
        historicalLinkCount: 0,
      }),
    ).toEqual({
      status: "active_signal_present",
      confidence: "high",
    });
  });
});

describe("summarizeBrand", () => {
  it("builds csv-friendly summaries", () => {
    const scans: PageScanResult[] = [
      {
        brand: "닥터지",
        bucket: "current",
        label: "shopping_brand",
        query: "닥터지",
        url: "https://example.com/a",
        finalUrl: "https://example.com/a",
        title: "닥터지",
        statusCode: 200,
        keywordCategories: [],
        evidenceLines: [],
        relevantLinks: [],
        note: "no_direct_signal",
      },
      {
        brand: "닥터지",
        bucket: "historical",
        label: "web_clip_history",
        query: "닥터지 클립",
        url: "https://example.com/b",
        finalUrl: "https://example.com/b",
        title: "닥터지 클립",
        statusCode: 200,
        keywordCategories: ["clip_history"],
        evidenceLines: ["닥터지 클립 캠페인"],
        relevantLinks: ["https://brandconnect.naver.com/example"],
        note: "signal_detected",
      },
    ];

    const summary = summarizeBrand("닥터지", scans, "2026-03-13T00:00:00.000Z");
    expect(summary.status).toBe("stopped_suspect");

    const csv = csvStringify([summarizeForCsv(summary)]);
    expect(csv).toContain("닥터지");
    expect(csv).toContain("stopped_suspect");
  });
});
