import {
  ComputationGoalType,
  Panel,
  ReductionGoalType,
  TaskType,
} from "./constructor-fields.type";
import { SubjectType } from "../../constructors/constants/constants";
import {
  ConstructorFormInput,
  ConstructorFormMultipleExpressionInput,
} from "../constructor-form/constructor-form.types";
import { LabeledValue } from "antd/es/select";

const startExpressionField: ConstructorFormInput = {
  name: "originalExpression",
  label: "Стартовое выражение",
  type: "text",
  isExpressionInput: true,
  width: 32,
};

const goalExpressionField: ConstructorFormInput = {
  name: "goalExpression",
  label: "Целевое выражение",
  type: "text",
  isExpressionInput: true,
  width: 32,
};

const signOptions: LabeledValue[] = ["=", ">", ">=", "<", "<="].map((el) => ({
  label: el,
  value: el,
}));

const signField: ConstructorFormInput = {
  name: "otherGoalData.comparisonType",
  label: "Знак",
  options: signOptions,
  isMulti: false,
  width: 6,
};

const computationGoalTypeOptions: LabeledValue[] = [
  {
    label: "Тип числа",
    value: ComputationGoalType.NUMBER_TYPE,
  },
  {
    label: "Заданные ответы",
    value: ComputationGoalType.CONCRETE_ANSWERS,
  },
  {
    label: "Паттерн",
    value: ComputationGoalType.PATTERN,
  },
  {
    label: "Вес",
    value: ComputationGoalType.WEIGHT,
  },
];

const computationGoalType: ConstructorFormInput = {
  name: "computationGoalType",
  label: "Результат вычисления",
  options: computationGoalTypeOptions,
  isMulti: false,
  width: 14,
};

const numTypeOptions: LabeledValue[] = ["N", "Z", "Q", "R", "C"].map((el) => {
  return { label: el, value: el };
});

const numTypeField: ConstructorFormInput = {
  name: "otherGoalData.numberType",
  label: "Тип числа",
  options: numTypeOptions,
  isMulti: false,
  width: 6,
};

const concreteAnswersField: ConstructorFormMultipleExpressionInput = {
  name: "otherGoalData.hiddenGoalExpressions",
  label: "Ответы",
  isMultipleExpressionInput: true,
  width: 100,
};

const goalPatternField: ConstructorFormInput = {
  name: "goalPattern",
  label: "Патерн цели",
  type: "text",
  width: 40,
};

const maxWeightField: ConstructorFormInput = {
  name: "otherGoalData.operationWeight",
  label: "Вес не больше чем",
  type: "text",
  width: 40,
};

const reductionGoalTypeOptions: LabeledValue[] = [
  ...computationGoalTypeOptions,
  {
    label: "Разложение на множители",
    value: ReductionGoalType.FACTORIZATION,
  },
  {
    label: "Сокращение",
    value: ReductionGoalType.REDUCTION,
  },
  {
    label: "Приведение к полиному",
    value: ReductionGoalType.POLYNOMIAL,
  },
];

const reductionGoalType: ConstructorFormInput = {
  name: "reductionGoalType",
  label: "Результат сведения",
  options: reductionGoalTypeOptions,
  isMulti: false,
  width: 20,
};

const minMultipliersField: ConstructorFormInput = {
  name: "otherGoalData.minMultipliersNumber",
  label: "Минимальное число множителей",
  type: "text",
  width: 40,
};

const varsListField: ConstructorFormInput = {
  name: "otherGoalData.listOfVariables",
  label: "Относительно переменных",
  type: "text",
  width: 40,
};

const fieldsMapping: {
  [key in SubjectType]: { [key in TaskType]: ConstructorFormInput[] };
} = {
  [SubjectType.STANDARD_MATH]: {
    [TaskType.PROOF]: [startExpressionField, signField, goalExpressionField],
    [TaskType.COMPUTATION]: [startExpressionField, computationGoalType],
    [TaskType.REDUCTION]: [startExpressionField, reductionGoalType],
  },
  // @ts-ignore
  [SubjectType.COMBINATORICS]: {},
  // @ts-ignore
  [SubjectType.COMPLEX_NUMBERS]: {},
  // @ts-ignore
  [SubjectType.LOGIC]: {},
  // @ts-ignore
  [SubjectType.PHYSICS]: {},
};

export const computationAdditionalFields: {
  [key in ComputationGoalType]: ConstructorFormInput[];
} = {
  [ComputationGoalType.NUMBER_TYPE]: [numTypeField],
  [ComputationGoalType.CONCRETE_ANSWERS]: [concreteAnswersField],
  [ComputationGoalType.PATTERN]: [goalPatternField],
  [ComputationGoalType.WEIGHT]: [maxWeightField],
};

export const reductionAdditionalFields: {
  [key in ReductionGoalType]: ConstructorFormInput[];
} = {
  [ReductionGoalType.FACTORIZATION]: [minMultipliersField],
  [ReductionGoalType.REDUCTION]: [],
  [ReductionGoalType.POLYNOMIAL]: [varsListField],

  [ComputationGoalType.NUMBER_TYPE]: [numTypeField],
  [ComputationGoalType.CONCRETE_ANSWERS]: [concreteAnswersField],
  [ComputationGoalType.PATTERN]: [goalPatternField],
  [ComputationGoalType.WEIGHT]: [maxWeightField],
};

export const getMainConditionsFields = (
  subjectType: SubjectType,
  taskType: TaskType,
  computationalGoalType: ComputationGoalType,
  reductionGoalType: ReductionGoalType
): ConstructorFormInput[] => {
  if (!subjectType || !taskType) {
    return [];
  }

  let inputs = fieldsMapping[subjectType][taskType];

  if (taskType === TaskType.COMPUTATION && computationalGoalType) {
    inputs = [...inputs, ...computationAdditionalFields[computationalGoalType]];
  }

  if (taskType === TaskType.REDUCTION && reductionGoalType) {
    inputs = [...inputs, ...reductionAdditionalFields[reductionGoalType]];
  }

  return inputs.map((input) => {
    input.panel = Panel.BASIC_CONDITIONS;
    return input;
  });
};
