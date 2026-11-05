import { createRequire } from "module";
import type PptxGenJS from "pptxgenjs";

const require = createRequire(import.meta.url);
const pptxgen = require("pptxgenjs");

export interface PptxOptions {
  title: string;
  topic?: string;
  subtitle?: string;
  slides?: Array<{
    title: string;
    bullets: string[];
    kpi?: { label: string; value: string };
  }>;
}

export async function generatePptxBuffer(options: PptxOptions): Promise<Buffer> {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "mtagi by Abhishek Gupta";
  pres.title = options.title || "Business Presentation";

  const isQBR = (options.title + " " + (options.topic || "")).toLowerCase().includes("quarterly") ||
    (options.title + " " + (options.topic || "")).toLowerCase().includes("qbr") ||
    (options.title + " " + (options.topic || "")).toLowerCase().includes("business review");

  // Slide 1: Title Slide
  const slide1 = pres.addSlide();
  slide1.background = { color: "0F172A" };
  slide1.addText(options.title || "Quarterly Business Review", {
    x: 1.0,
    y: 2.2,
    w: 11.3,
    h: 1.2,
    fontSize: 40,
    bold: true,
    color: "3B82F6",
    fontFace: "Arial",
  });
  slide1.addText(
    options.subtitle ||
      (isQBR ? "Q3 2026 Comprehensive Performance & Q4 Strategic Roadmap" : "Strategic Vision, Market Opportunity & Financial Overview"),
    {
      x: 1.0,
      y: 3.5,
      w: 11.3,
      h: 0.8,
      fontSize: 20,
      color: "F8FAFC",
      fontFace: "Arial",
    },
  );
  slide1.addText("Created with mtagi • by Abhishek Gupta", {
    x: 1.0,
    y: 6.2,
    w: 8.0,
    h: 0.4,
    fontSize: 12,
    color: "06B6D4",
    fontFace: "Arial",
  });

  // Slide 2: Agenda
  const slide2 = pres.addSlide();
  slide2.background = { color: "F8FAFC" };
  slide2.addText("Executive Agenda", {
    x: 0.8,
    y: 0.6,
    w: 10,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: "0F172A",
  });
  const agendaItems = isQBR
    ? [
        "1. Executive Performance Summary",
        "2. Financial Highlights & Margins",
        "3. Sales Pipeline & Regional Breakdown",
        "4. Product Releases & Customer Success",
        "5. Q4 Objectives & Strategic Milestones",
      ]
    : [
        "1. Problem & Market Need",
        "2. Solution & Technology Architecture",
        "3. Market Opportunity (TAM/SAM/SOM)",
        "4. Business Model & Financial Forecast",
        "5. Growth Roadmap & Capital Allocation",
      ];
  slide2.addText(agendaItems.join("\n\n"), {
    x: 0.8,
    y: 1.8,
    w: 10,
    h: 4.5,
    fontSize: 18,
    color: "334155",
    lineSpacing: 28,
  });

  // Slide 3: Executive Summary & Highlights
  const slide3 = pres.addSlide();
  slide3.background = { color: "FFFFFF" };
  slide3.addText(isQBR ? "Executive Summary & Key Results" : "Core Problem & Market Opportunity", {
    x: 0.8,
    y: 0.6,
    w: 10,
    h: 0.8,
    fontSize: 30,
    bold: true,
    color: "0F172A",
  });
  const highlights = isQBR
    ? [
        "Delivered solid top-line revenue growth (+8% YoY) driven by new market expansion.",
        "Net profit margin expanded by +2.5 percentage points with improved operational discipline.",
        "Customer churn declined to an all-time low of 0.8% following automated onboarding rollout.",
        "Successful market entry into high-growth international territories.",
      ]
    : [
        "Enterprise customers face fragmented legacy workflows and rising operational costs.",
        "Over 70% of organizations struggle with slow execution and data silos.",
        "Our unified platform delivers 10x faster insights with automated workflows.",
        "Targeting an initial $15B addressable market with high retention potential.",
      ];
  slide3.addText(highlights.map((h) => `• ${h}`).join("\n\n"), {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 4.5,
    fontSize: 16,
    color: "334155",
  });
  // Right KPI Card
  slide3.addShape(pres.ShapeType.rect, {
    x: 8.0,
    y: 1.6,
    w: 4.2,
    h: 4.5,
    fill: { color: "0F172A" },
    line: { color: "3B82F6", width: 2 },
  });
  slide3.addText(isQBR ? "+8% YoY\nRevenue Growth" : "$15B\nMarket TAM", {
    x: 8.2,
    y: 2.5,
    w: 3.8,
    h: 1.5,
    fontSize: 26,
    bold: true,
    align: "center",
    color: "06B6D4",
  });
  slide3.addText(isQBR ? "EBITDA Margin: +12%\nNPS Score: 71" : "3-Year CAGR: 28%\nClear Path to Scale", {
    x: 8.2,
    y: 4.2,
    w: 3.8,
    h: 1.2,
    fontSize: 15,
    align: "center",
    color: "F8FAFC",
  });

  // Slide 4: Financial & Performance Overview
  const slide4 = pres.addSlide();
  slide4.background = { color: "F8FAFC" };
  slide4.addText(isQBR ? "Financial Performance & KPIs" : "Business Model & Revenue Streams", {
    x: 0.8,
    y: 0.6,
    w: 10,
    h: 0.8,
    fontSize: 30,
    bold: true,
    color: "0F172A",
  });
  const metrics = isQBR
    ? [
        { label: "Q3 Gross Revenue", val: "$14.2M", desc: "Exceeded plan by +6%" },
        { label: "EBITDA Margin", val: "22.5%", desc: "+180 bps vs prior year" },
        { label: "Operating Cash", val: "$4.8M", desc: "Strong working capital buffer" },
      ]
    : [
        { label: "SaaS Subscription", val: "80%", desc: "Recurring annual contracts" },
        { label: "Expansion Revenue", val: "135%", desc: "Net Dollar Retention rate" },
        { label: "Gross Margin", val: "78%", desc: "Highly scalable cloud economics" },
      ];

  metrics.forEach((m, idx) => {
    const cardX = 0.8 + idx * 3.8;
    slide4.addShape(pres.ShapeType.roundRect, {
      x: cardX,
      y: 1.8,
      w: 3.5,
      h: 4.0,
      fill: { color: "FFFFFF" },
      line: { color: "CBD5E1", width: 1 },
    });
    slide4.addText(m.label, {
      x: cardX + 0.2,
      y: 2.2,
      w: 3.1,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: "64748B",
      align: "center",
    });
    slide4.addText(m.val, {
      x: cardX + 0.2,
      y: 2.9,
      w: 3.1,
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: "3B82F6",
      align: "center",
    });
    slide4.addText(m.desc, {
      x: cardX + 0.2,
      y: 4.0,
      w: 3.1,
      h: 0.8,
      fontSize: 14,
      color: "334155",
      align: "center",
    });
  });

  // Slide 5: Roadmap & Next Steps
  const slide5 = pres.addSlide();
  slide5.background = { color: "0F172A" };
  slide5.addText(isQBR ? "Q4 Strategic Goals & Milestones" : "Strategic Roadmap & Objectives", {
    x: 0.8,
    y: 0.6,
    w: 10,
    h: 0.8,
    fontSize: 30,
    bold: true,
    color: "3B82F6",
  });
  const goals = isQBR
    ? [
        "Scale regional sales teams across EMEA and APAC to accelerate Q4 pipeline.",
        "Launch the automated AI workflow assistant (Beta) to drive product upsell.",
        "Maintain customer retention target with churn rate below 0.8%.",
        "Targeting 10% sequential revenue expansion in Q4.",
      ]
    : [
        "Expand product feature suite to support enterprise-grade integrations.",
        "Accelerate sales hiring and strategic channel partnerships.",
        "Strengthen competitive moats with proprietary technology workflows.",
        "Deliver against 3-year operating targets with disciplined unit economics.",
      ];
  slide5.addText(goals.map((g) => `✔  ${g}`).join("\n\n"), {
    x: 0.8,
    y: 1.8,
    w: 10,
    h: 3.8,
    fontSize: 17,
    color: "F8FAFC",
  });
  slide5.addText("Thank You • Questions & Discussion", {
    x: 0.8,
    y: 5.8,
    w: 10,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: "06B6D4",
  });

  const buffer = (await pres.write({ outputType: "nodebuffer" })) as Buffer;
  return buffer;
}

