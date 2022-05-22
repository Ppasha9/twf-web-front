import {RuleConstructorReceivedForm} from "../constructors/rule-constructor/rule-constructor.types";
import {TaskConstructorReceivedForm} from "../constructors/task-constructor/task-constructor.types";
import {
  RulePackConstructorReceivedForm,
  RulePackLink
} from "../constructors/rule-pack-constructor/rule-pack-constructor.types";

const twf_js = (window as any)['twf_js'];
// @ts-ignore
// import twf_js from '../../public/kotlin-lib/twf_js';

// LIB API FUNCTIONS
// format -> expression
export const stringToExpression = twf_js.stringToExpression;
const structureStringToExpression = twf_js.structureStringToExpression;
const expressionSubstitutionFromStructureStrings = twf_js.expressionSubstitutionFromStructureStrings;
const texToExpression = twf_js.stringToExpression;
// const getUserLogInPlainText = twf_js.getUserLogInPlainText;

// expression -> format
const expressionToTexString = twf_js.expressionToTexString;
const expressionToStructureString = twf_js.expressionToStructureString;
const expressionToString = twf_js.expressionToString;

class MathInputConvertingError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "MathInputConvertingError";
  }
}

export enum MathInputFormat {
  TEX = "TEX",
  STRUCTURE_STRING = "STRUCTURE_STRING",
  PLAIN_TEXT = "PLAIN_TEXT",
}

export const convertMathInput = (
  from: MathInputFormat,
  to: MathInputFormat,
  expression: string
): string | any => {
  try {
    const expressionInLibFormat: any = (() => {
      if (from === MathInputFormat.PLAIN_TEXT) {
        return stringToExpression(expression);
      } else if (from === MathInputFormat.STRUCTURE_STRING) {
        return structureStringToExpression(expression);
      } else if (from === MathInputFormat.TEX) {
        // lib understands '//' as '/' in classic TEX
        return texToExpression(expression.replace(/\//g, "//"));
      }
    })();
    if (expressionInLibFormat.nodeType.name$ === "ERROR") {
      throw new MathInputConvertingError(expressionInLibFormat.value);
    }
    if (to === MathInputFormat.PLAIN_TEXT) {
      return expressionToString(expressionInLibFormat);
    } else if (to === MathInputFormat.STRUCTURE_STRING) {
      return expressionToStructureString(expressionInLibFormat);
    } else if (to === MathInputFormat.TEX) {
      return expressionToTexString(expressionInLibFormat);
    }
  } catch (e: any) {
    console.error("ERROR WHILE DOING MATH CONVERTING", e.message, e);
    return "ERROR WHILE GETTING ERROR FROM MATH INPUT: " + e.message
  }
};

export const getErrorFromMathInput = (
  format: MathInputFormat,
  expression: string
): string | null => {
  try {
    const expressionInLibFormat: any = (() => {
      if (format === MathInputFormat.PLAIN_TEXT) {
        return stringToExpression(expression);
      } else if (format === MathInputFormat.STRUCTURE_STRING) {
        return structureStringToExpression(expression);
      } else if (format === MathInputFormat.TEX) {
        // lib understands '//' as '/' in classic TEX
        return texToExpression(expression.replace(/\//g, "//"));
      }
    })();
    return expressionInLibFormat.nodeType.name$ === "ERROR"
      ? expressionInLibFormat.value
      : null;
  } catch (e: any) {
    console.error("ERROR WHILE GETTING ERROR FROM MATH INPUT", e.message, e);
    return "ERROR WHILE GETTING ERROR FROM MATH INPUT: " + e.message
  }
};

export const createRuleITR = (
    rule: RuleConstructorReceivedForm,
    subjectType: String
) => {
  try {
    return twf_js.createRuleITR(
        rule.code,
        rule.nameEn,
        rule.nameRu,
        rule.descriptionShortEn,
        rule.descriptionShortRu,
        rule.descriptionEn,
        rule.descriptionRu,

        twf_js.createExpressionFrontInput(rule.leftStructureString, "STRUCTURE_STRING"),
        twf_js.createExpressionFrontInput(rule.rightStructureString, "STRUCTURE_STRING"),
        rule.priority,
        rule.isExtending,
        rule.matchJumbledAndNested,
        rule.simpleAdditional,
        rule.basedOnTaskContext,
        rule.normalizationType,
        rule.weight,
        subjectType
    );
  } catch (e: any) {
    console.error("ERROR WHILE CREATING RULE ITR", e.message, e);
  }
};

export const createRulePackITR = (
    rulePack: RulePackConstructorReceivedForm
) => {
  try {
    return twf_js.createRulePackITR(
        rulePack.code,
        0,
        rulePack.namespaceCode,
        rulePack.nameEn,
        rulePack.nameRu,
        rulePack.descriptionShortEn,
        rulePack.descriptionShortRu,
        rulePack.descriptionEn,
        rulePack.descriptionRu,

        rulePack.subjectType,
        rulePack.rulePacks?.map(function(rulePackLink: RulePackLink){
          return createRulePackLinkITR(rulePackLink);
        }),
        rulePack.rules?.map(function(rule: RuleConstructorReceivedForm){
          return createRuleITR(rule, rulePack.subjectType);
        }),

        rulePack.otherCheckSolutionData? JSON.stringify(rulePack.otherCheckSolutionData) : null,
        rulePack.otherAutoGenerationData? JSON.stringify(rulePack.otherAutoGenerationData) : null,
        rulePack.otherData? JSON.stringify(rulePack.otherData) : null,
    );
  } catch (e: any) {
    console.error("ERROR WHILE CREATING RULE PACK ITR", e.message, e);
  }
};

export const createRulePackLinkITR = (
    rulePackLink: RulePackLink
) => {
  try {
    return twf_js.createRulePackLinkITR(
        rulePackLink.namespaceCode,
        rulePackLink.rulePackCode
    );
  } catch (e: any) {
    console.error("ERROR WHILE CREATING RULE PACK LINK ITR", e.message, e);
  }
};

export const createTaskITR = (
    task: TaskConstructorReceivedForm
) => {
  try {
    return twf_js.createTaskITR(
        task.taskCreationType,

        task.code,
        task.namespaceCode,
        task.nameEn,
        task.nameRu,
        task.descriptionShortEn,
        task.descriptionShortRu,
        task.descriptionEn,
        task.descriptionRu,

        task.subjectType,
        task.tags,

        twf_js.createExpressionFrontInput(task.originalExpressionStructureString, "STRUCTURE_STRING"),

        task.goalType.toString(),
        task.goalExpression ? twf_js.createExpressionFrontInput(task.goalExpressionStructureString, "STRUCTURE_STRING") : null,
        task.goalPattern,
        null,
        task.otherGoalData ? JSON.stringify(task.otherGoalData) : null,

        task.rulePacks.map(function(rulePackLink: RulePackLink){
          return createRulePackLinkITR(rulePackLink);
        }),
        task.rules.map(function(rule: RuleConstructorReceivedForm){
          return createRuleITR(rule, task.subjectType);
        }),

        task.stepsNumber,
        task.time,
        task.difficulty,

        task.solution,
        task.solutionsStepsTree ? JSON.stringify(task.solutionsStepsTree) : null,

        task.interestingFacts ? JSON.stringify(task.interestingFacts) : null,
        task.nextRecommendedTasks ? JSON.stringify(task.nextRecommendedTasks) : null,

        task.hints? JSON.stringify(task.hints) : null,
        "{\"otherCheckSolutionData\": {  \"nullWeightOperations\": [  {\"name\": \"\",  \"numberOfArguments\": 0 },  {\"name\": \"\",  \"numberOfArguments\": 1 },  {  \"name\": \"+\",  \"numberOfArguments\": \"-1\" },  {  \"name\": \"-\",  \"numberOfArguments\": \"-1\" },  {  \"name\": \"*\",  \"numberOfArguments\": \"-1\" },  {  \"name\": \"/\",  \"numberOfArguments\": \"-1\" }  ],  \"lightWeightOperations\": [  {\"name\": \"\",  \"numberOfArguments\": 0 },  {\"name\": \"\",  \"numberOfArguments\": 1 },  {  \"name\": \"+\",  \"numberOfArguments\": -1 },  {  \"name\": \"-\",  \"numberOfArguments\": \"-1\" },  {  \"name\": \"*\",\"numberOfArguments\": \"-1\"}, { \"name\": \"/\",\"numberOfArguments\": \"-1\"}]}}",
        //"{\"otherCheckSolutionData\": {  \"nullWeightOperations\": [  {\"name\": \"\",  \"numberOfArguments\": \"0\",  \"needRules\": \"false\"  },  {\"name\": \"\",  \"numberOfArguments\": \"1\",  \"needRules\": \"false\"  },  {  \"name\": \"+\",  \"numberOfArguments\": \"-1\",  \"needRules\": \"false\"  },  {  \"name\": \"-\",  \"numberOfArguments\": \"-1\",  \"needRules\": \"false\"  },  {  \"name\": \"*\",  \"numberOfArguments\": \"-1\",  \"needRules\": \"false\"  },  {  \"name\": \"/\",  \"numberOfArguments\": \"-1\",  \"needRules\": \"false\"  }  ],  \"lightWeightOperations\": [  {\"name\": \"\",  \"numberOfArguments\": \"0\",  \"needRules\": \"false\"  },  {\"name\": \"\",  \"numberOfArguments\": \"1\",  \"needRules\": \"false\"  },  {  \"name\": \"+\",  \"numberOfArguments\": -1,  \"needRules\": \"false\"  },  {  \"name\": \"-\",  \"numberOfArguments\": \"-1\",  \"needRules\": \"false\"  },  {  \"name\": \"*\",\"numberOfArguments\": \"-1\",\"needRules\": \"false\"}, { \"name\": \"/\",\"numberOfArguments\": \"-1\",\"needRules\": \"false\"}]}}",
        //task.otherCheckSolutionData? JSON.stringify(task.otherCheckSolutionData) : null,

        task.countOfAutoGeneratedTasks,
        task.otherAutoGenerationData? JSON.stringify(task.otherAutoGenerationData) : null,

        task.otherAwardData? JSON.stringify(task.otherAwardData) : null,
        task.otherData? JSON.stringify(task.otherData) : null,
    );
  } catch (e: any) {
    console.error("ERROR WHILE CREATING TASK ITR", e.message, e);
  }
};

function copyTextToClipboard(text: string, message: string) {
  let textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    let successful = document.execCommand('copy');
    if (message.length > 0) {
      alert(message);
    }
  } catch (err) {
    alert(err);
  }

  document.body.removeChild(textArea);
};

export function copyAllLogInPlainText () {
  copyTextToClipboard(twf_js.getAllLogInPlainText(), "copyAllLogInPlainText - log is copied");
};

export function copyUserLogInPlainText () {
  copyTextToClipboard(twf_js.getUserLogInPlainText(), "copyUserLogInPlainText - log is copied");
};

export const checkTexSolutionInFrontFormat = (
    fullExpression: string,
    task: TaskConstructorReceivedForm,
    rulePacks?: RulePackConstructorReceivedForm[],
    shortErrorDescription?: string,
    skipTrivialCheck: boolean = false,
) => {
  try {
    console.log("otherCheckSolutionData: ", task.otherCheckSolutionData);
//    task.otherCheckSolutionData = "{\"otherCheckSolutionData\": {  \"nullWeightOperations\": [  {\"name\": \"\",  \"numberOfArguments\": 0,  \"needRules\": false  },  {\"name\": \"\",  \"numberOfArguments\": 1,  \"needRules\": false  },  {  \"name\": \"+\",  \"numberOfArguments\": -1,  \"needRules\": false  },  {  \"name\": \"-\",  \"numberOfArguments\": -1,  \"needRules\": false  },  {  \"name\": \"*\",  \"numberOfArguments\": -1,  \"needRules\": false  },  {  \"name\": \"/\",  \"numberOfArguments\": -1,  \"needRules\": false  }  ],  \"lightWeightOperations\": [  {\"name\": \"\",  \"numberOfArguments\": 0,  \"needRules\": false  },  {\"name\": \"\",  \"numberOfArguments\": 1,  \"needRules\": false  },  {  \"name\": \"+\",  \"numberOfArguments\": -1,  \"needRules\": false  },  {  \"name\": \"-\",  \"numberOfArguments\": -1,  \"needRules\": false  },  {  \"name\": \"*\",\"numberOfArguments\": -1,\"needRules\": false}, { \"name\": \"/\",\"numberOfArguments\": -1,\"needRules\": false}]}}";
    const taskITR = createTaskITR(task);
    const rulePacksITR = rulePacks?.map(function(rulePack: RulePackConstructorReceivedForm){
      return createRulePackITR(rulePack);
    });
    console.log("taskITR: ", taskITR);
    console.log("rulePacksITR: ", rulePacksITR);
    let result =  twf_js.checkSolutionInTexITR(fullExpression,
        taskITR,
        rulePacksITR,
        shortErrorDescription,
        skipTrivialCheck);
    return result;
  } catch (e: any) {
    console.error("ERROR WHILE CHECKING TEX", e.message, e);
    console.log("fullExpression:", fullExpression);
    // console.log(getUserLogInPlainText())
  }
};

export const checkTex = (
    fullExpression?: string,
    start?: string,
    end?: string,
    rules?: Array<RuleConstructorReceivedForm>
) => {
  try {
    console.log("checkTex:", fullExpression);
    let expressions;
    if (rules) {
      expressions = rules?.map(function(rule: RuleConstructorReceivedForm){
        return expressionSubstitutionFromStructureStrings(rule.leftStructureString, rule.rightStructureString, rule.basedOnTaskContext, rule.matchJumbledAndNested, rule.simpleAdditional, rule.isExtending, rule.priority, rule.code, rule.nameEn, rule.nameRu);
      });
    }
    return twf_js.checkSolutionInTex(
        fullExpression,
        start,
        undefined,
        "",
        end === null ? "" : end,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        expressions,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
  } catch (e: any) {
    console.error("ERROR WHILE CHECKING TEX", e.message, e);
    console.log("fullExpression:", fullExpression);
    console.log("start:", start);
    console.log("end:", end);
    // console.log(getUserLogInPlainText())
  }
};
