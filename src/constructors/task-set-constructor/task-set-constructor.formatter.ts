import {
  TaskSetConstructorInputs,
  TaskSetConstructorReceivedForm,
  TaskSetConstructorSendForm,
} from "./task-set-constructor.types";
import {
  convertMathInput,
  MathInputFormat,
} from "../../utils/kotlin-lib-functions";
import { TaskConstructorReceivedForm } from "../task-constructor/task-constructor.types";
import { convertInputStringListSeparatedByCommasToArray } from "../../redux/constructor-jsons/constructor-jsons.utils";

class TaskSetConstructorFormatter {
  public static convertReceivedFormToConstructorInputs(
    data: TaskSetConstructorReceivedForm
  ): TaskSetConstructorInputs {
    return {
      ...data,
      tasks: data.tasks.map((task: TaskConstructorReceivedForm) => {
        const taskCopy: any = { ...task };
        // format expression inputs
        taskCopy.originalExpression = {
          format: MathInputFormat.TEX,
          expression: task.originalExpressionTex,
        };
        taskCopy.goalExpression = {
          format: MathInputFormat.TEX,
          expression: task.goalExpressionTex,
        };
        taskCopy.solution = {
          format: MathInputFormat.TEX,
          expression:
            task.solution && task.solution !== "" && task.solution !== "()"
              ? convertMathInput(
                  MathInputFormat.STRUCTURE_STRING,
                  MathInputFormat.TEX,
                  task.solution
                )
              : "",
        };
        taskCopy.rulePacks = task.rulePacks.map(
          (rulePack: any) => rulePack.rulePackCode
        );
        [
          "originalExpressionTex",
          "originalExpressionStructureString",
          "originalExpressionPlainText",
          "goalExpressionTex",
          "goalExpressionPlainText",
          "goalExpressionStructureString",
        ].forEach((key: string) => delete taskCopy[key]);
        taskCopy.taskCreationType =
          taskCopy.countOfAutoGeneratedTasks > 0 ? "auto" : "manual";
        return taskCopy;
      }),
    };
  }
  public static convertConstructorInputsToSendForm(
    data: TaskSetConstructorInputs
  ): TaskSetConstructorSendForm {
    if (data.tasks) {
      data.tasks.forEach((task: any) => {
        if (task.originalExpression.format === MathInputFormat.TEX) {
          task.originalExpressionTex = task.originalExpression.expression;
          task.originalExpressionPlainText = convertMathInput(
            MathInputFormat.TEX,
            MathInputFormat.PLAIN_TEXT,
            task.originalExpression.expression
          );
          task.originalExpressionStructureString = convertMathInput(
            MathInputFormat.TEX,
            MathInputFormat.STRUCTURE_STRING,
            task.originalExpression.expression
          );
        } else if (
          task.originalExpression.format === MathInputFormat.PLAIN_TEXT
        ) {
          task.originalExpressionPlainText = task.originalExpression.expression;
          task.originalExpressionTex = convertMathInput(
            MathInputFormat.PLAIN_TEXT,
            MathInputFormat.TEX,
            task.originalExpression.expression
          );
          task.originalExpressionStructureString = convertMathInput(
            MathInputFormat.PLAIN_TEXT,
            MathInputFormat.STRUCTURE_STRING,
            task.originalExpression.expression
          );
        } else if (
          task.originalExpression.format === MathInputFormat.STRUCTURE_STRING
        ) {
          task.originalExpressionStructureString =
            task.originalExpression.expression;
          task.originalExpressionPlainText = convertMathInput(
            MathInputFormat.STRUCTURE_STRING,
            MathInputFormat.PLAIN_TEXT,
            task.originalExpression.expression
          );
          task.originalExpressionTex = convertMathInput(
            MathInputFormat.STRUCTURE_STRING,
            MathInputFormat.TEX,
            task.originalExpression.expression
          );
        }
        if (task.goalExpression.format === MathInputFormat.TEX) {
          task.goalExpressionTex = task.goalExpression.expression;
          task.goalExpressionPlainText = convertMathInput(
            MathInputFormat.TEX,
            MathInputFormat.PLAIN_TEXT,
            task.goalExpression.expression
          );
          task.goalExpressionStructureString = convertMathInput(
            MathInputFormat.TEX,
            MathInputFormat.STRUCTURE_STRING,
            task.goalExpression.expression
          );
        } else if (task.goalExpression.format === MathInputFormat.PLAIN_TEXT) {
          task.goalExpressionPlainText = task.goalExpression.expression;
          task.goalExpressionTex = convertMathInput(
            MathInputFormat.PLAIN_TEXT,
            MathInputFormat.TEX,
            task.goalExpression.expression
          );
          task.goalExpressionStructureString = convertMathInput(
            MathInputFormat.PLAIN_TEXT,
            MathInputFormat.STRUCTURE_STRING,
            task.goalExpression.expression
          );
        } else if (
          task.goalExpression.format === MathInputFormat.STRUCTURE_STRING
        ) {
          task.goalExpressionStructureString = task.goalExpression.expression;
          task.goalExpressionPlainText = convertMathInput(
            MathInputFormat.STRUCTURE_STRING,
            MathInputFormat.PLAIN_TEXT,
            task.goalExpression.expression
          );
          task.goalExpressionTex = convertMathInput(
            MathInputFormat.STRUCTURE_STRING,
            MathInputFormat.TEX,
            task.goalExpression.expression
          );
        }
        if (task.solution.format !== MathInputFormat.STRUCTURE_STRING) {
          task.solution = convertMathInput(
            task.solution.format,
            MathInputFormat.STRUCTURE_STRING,
            task.solution.expression
          );
        } else {
          task.solution = task.solution.expression;
        }
        task.goalNumberProperty = parseInt(task.goalNumberProperty);
        task.stepsNumber = parseInt(task.stepsNumber);
        task.time = parseInt(task.time);
        task.difficulty = parseFloat(task.difficulty);
        task.stepsNumber = parseInt(task.stepsNumber);
        task.countOfAutoGeneratedTasks = parseInt(
          task.countOfAutoGeneratedTasks
        );
        task.maxNumberOfAutogeneratedTasks = parseInt(
          task.maxNumberOfAutogeneratedTasks
        );
        task.numberOfAutogeneratedTasksToSolve = parseInt(
          task.numberOfAutogeneratedTasksToSolve
        );
        task.rulePacks = convertInputStringListSeparatedByCommasToArray(
          task.rulePacks
        ).map((rulePackCode: string) => ({
          rulePackCode,
        }));
        delete task.originalExpression;
        delete task.goalExpression;
        ["subjectTypes", "rulePacks", "autoGeneratedRulePacks"].forEach(
          (key: string) => {
            if (!task[key]) {
              task[key] = [];
            }
          }
        );
        [
          "otherGoalData",
          "otherCheckSolutionData",
          "otherAwardData",
          "otherAutogenerationData",
          "otherData",
        ].forEach((key: string) => {
          if (task[key] === "") {
            task[key] = null;
          }
        });
      });
    }
    if (!data.subjectTypes) {
      data.subjectTypes = [];
    }
    if (!data.otherData) {
      data.otherData = null;
    }
    // @ts-ignore
    return data;
  }
}

export default TaskSetConstructorFormatter;
