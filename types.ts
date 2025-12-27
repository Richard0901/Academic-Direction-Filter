export enum MigrationLogicType {
  LINEAGE = "谱系延伸 (Lineage Extension)",
  NICHE = "生态位迁移 (Niche Migration)",
  METHODOLOGY = "方法论入侵 (Methodology Invasion)",
  PAIN_POINT = "痛点镜像 (Pain Point Mirroring)",
  COUPLING = "互补耦合 (Complementary Coupling)",
  PARADIGM = "范式升级 (Paradigm Upgrade)"
}

export interface Evaluation {
  innovationScore: number;
  feasibilityScore: number;
  continuityScore: number;
  logicalityScore: number;
  analysis: string;
}

export interface ResearchDirection {
  title: string;
  logicType: MigrationLogicType | string;
  combinationFormula: string;
  migrationLogicDescription: string;
  resourceMatch: string;
  grantPitch: string;
  evaluation: Evaluation;
}

export interface AnalysisResponse {
  directions: ResearchDirection[];
}

export interface UserInput {
  academicAssets: string;
  marketAnalysis: string;
}