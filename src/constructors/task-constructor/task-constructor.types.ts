import { RulePackLink } from "../rule-pack-constructor/rule-pack-constructor.types";
import { MathInputFormat } from "../../utils/kotlin-lib-functions";
import { RuleConstructorInputs, RuleConstructorReceivedForm } from "../rule-constructor/rule-constructor.types";

export interface ExpressionInput {
  format: MathInputFormat;
  expression: string;
}

export enum GoalType {
  CUSTOM = "CUSTOM",
  EXPRESSION = "EXPRESSION",
  COMPUTATION = "COMPUTATION",
  SIMPLIFICATION = "SIMPLIFICATION",
  CNF = "CNF",
  DNF = "DNF",
  FACTORIZATION = "FACTORIZATION",
  UNKNOWN = "UNKNOWN",
}

export interface TaskConstructorProps {
  index: number;
  defaultValue: any;
  updateDemo: (index: number) => void;
  visualizationMode: "table" | "list";
  isRendered?: boolean;
  updateName?: (index: number, newName: string) => void;
  rulePacks: string[];
}

export interface TaskConstructorReceivedForm {
  taskCreationType: "auto" | "manual";
  namespaceCode: string;
  code: string;
  nameEn: string;
  nameRu: string;
  descriptionShortEn: string;
  descriptionShortRu: string;
  descriptionEn: string;
  descriptionRu: string;
  subjectType: string;
  tags: any;
  originalExpressionStructureString: string;
  originalExpressionTex: string;
  originalExpressionPlainText: string;
  originalExpression: ExpressionInput;
  goalType: GoalType;
  goalExpressionStructureString: string;
  goalExpressionTex: string;
  goalExpressionPlainText: string;
  goalExpression: ExpressionInput;
  goalPattern: string;
  otherGoalData: any;
  rulePacks: RulePackLink[];
  rules: RuleConstructorReceivedForm[];
  stepsNumber: number;
  time: number;
  difficulty: number;
  solution: any;
  solutionsStepsTree: any;
  hints: any;
  otherCheckSolutionData: any;
  countOfAutoGeneratedTasks: number;
  otherAutoGenerationData: any;
  interestingFacts: any;
  otherAwardData: any;
  nextRecommendedTasks: any;
  otherData: any;
}

export interface TaskConstructorInputs {
  taskCreationType: "auto" | "manual";
  namespaceCode: string;
  code: string;
  nameEn: string;
  nameRu: string;
  descriptionShortEn: string;
  descriptionShortRu: string;
  descriptionEn: string;
  descriptionRu: string;
  subjectType: string;
  tags: any;
  originalExpression: ExpressionInput;
  goalType: GoalType;
  goalExpression: ExpressionInput;
  goalPattern: string;
  otherGoalData: any;
  rulePacks: string[] | string;
  rules: RuleConstructorInputs[];
  stepsNumber: number;
  time: number;
  difficulty: number;
  solution: any;
  solutionsStepsTree: any;
  hints: any;
  otherCheckSolutionData: any;
  countOfAutoGeneratedTasks: number;
  otherAutoGenerationData: any;
  interestingFacts: any;
  otherAwardData: any;
  nextRecommendedTasks: any;
  otherData: any;
}
