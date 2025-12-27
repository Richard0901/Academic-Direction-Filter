import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse } from "../types";

const apiKey = process.env.API_KEY;
// Initialize with a fallback to avoid crashing during static analysis if env is missing, 
// though it is required for runtime.
const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });

const evaluationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    innovationScore: { 
      type: Type.INTEGER, 
      description: "Score from 1 to 10. Innovation: Frontier status, originality, addressing real pain points." 
    },
    feasibilityScore: { 
      type: Type.INTEGER, 
      description: "Score from 1 to 10. Feasibility: Can the user realistically achieve this?" 
    },
    continuityScore: { 
      type: Type.INTEGER, 
      description: "Score from 1 to 10. Continuity: Utilization of existing academic assets." 
    },
    logicalityScore: { 
      type: Type.INTEGER, 
      description: "Score from 1 to 10. Logicality: Is the scientific story coherent?" 
    },
    analysis: { 
      type: Type.STRING, 
      description: "Brief analysis (1-2 sentences) of the balance between these four dimensions." 
    }
  },
  required: ["innovationScore", "feasibilityScore", "continuityScore", "logicalityScore", "analysis"]
};

const directionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Recommended research direction title",
    },
    logicType: {
      type: Type.STRING,
      description: "One of the 6 migration logics (e.g., '谱系延伸', '范式升级')",
    },
    combinationFormula: {
      type: Type.STRING,
      description: "The combination formula: [A: Asset] + [B: New Domain] + [C: Method]",
    },
    migrationLogicDescription: {
      type: Type.STRING,
      description: "Detailed explanation of the migration logic",
    },
    resourceMatch: {
      type: Type.STRING,
      description: "How well the user's assets match this direction",
    },
    grantPitch: {
      type: Type.STRING,
      description: "Persuasive text for grant application",
    },
    evaluation: evaluationSchema
  },
  required: ["title", "logicType", "combinationFormula", "migrationLogicDescription", "resourceMatch", "grantPitch", "evaluation"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    directions: {
      type: Type.ARRAY,
      items: directionSchema,
      description: "A list of 4-6 highly recommended research directions.",
    },
  },
  required: ["directions"],
};

export const generateDirections = async (
  assets: string,
  analysis: string
): Promise<AnalysisResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing from environment variables.");
  }

  const systemPrompt = `
  你是一位资深的科研职业规划师和基金申请辅导专家。你擅长评估科研人员的“技术资产”，并帮他们规划如何以最小的“迁移成本”切入最前沿的“蓝海领域”。
  
  核心分析逻辑：6维学术迁移原型
  1. 谱系延伸 (Lineage Extension)：同源性、近邻元素、结构变体
  2. 生态位迁移 (Niche Migration)：极端环境、新体系、固/液/气相变
  3. 方法论入侵 (Methodology Invasion)：工具降维、独特视角
  4. 痛点镜像 (Pain Point Mirroring)：机制同构、瓶颈复现
  5. 互补耦合 (Complementary Coupling)：系统适配、短板修补
  6. 范式升级 (Paradigm Upgrade)：数据驱动、预测模型

  新增评价维度：
  对每个生成的选题，必须基于以下四个维度进行评分（1-10分）和简要评价：
  1. 创新性 (Innovation)：是否前沿、是否原创、是否回应真实痛点。
  2. 可行性 (Feasibility)：基于用户的资产，做出来的成功率高不高。
  3. 延续性 (Continuity)：能否最大程度利用已有的积累（核心资产）。
  4. 逻辑性 (Logicality)：整个故事讲不讲得通，立项依据是否严密。

  任务目标：
  基于用户的“学术积累”，在“前序分析”指出的蓝海/无人区方向中，筛选出最值得申请的 4-5 个方向。
  请确保结果覆盖不同的迁移逻辑，不要重复单一逻辑。
  `;

  const userPrompt = `
  1）我的学术积累（核心资产）：
  ${assets}

  2）学术战略大师的前序分析结果：
  ${analysis}

  请严格按照 JSON 格式输出，生成 4-5 个具体的推荐方向，并包含对四个平衡维度的评分和评价。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 1024 } 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};