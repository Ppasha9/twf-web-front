import {
  SUBJECT_TYPE_OPTIONS,
  SubjectType,
} from "../../constructors/constants/constants";
import { Panel, TaskType } from "./constructor-fields.type";
import { ConstructorFormInput } from "../constructor-form/constructor-form.types";
import { LabeledValue } from "antd/es/select";

export const getSubjectTaskTypeFields = (
  subjectType: SubjectType
): ConstructorFormInput[] => {
  return [
    {
      name: `subjectType`,
      label: "Предметная область",
      isMulti: false,
      options: SUBJECT_TYPE_OPTIONS,
      width: 15,
      panel: Panel.SUBJECT_TASK_TYPE,
    },
    {
      name: `taskType`,
      label: "Тип задачи",
      options: taskTypeOption[subjectType],
      isMulti: false,
      width: 12,
      panel: Panel.SUBJECT_TASK_TYPE,
    },
  ];
};

const proofTaskType: LabeledValue = {
  label: "Доказательство",
  value: TaskType.PROOF,
};

const computationTaskType: LabeledValue = {
  label: "Вычисление",
  value: TaskType.COMPUTATION,
};

const reductionTaskType: LabeledValue = {
  label: "Сокращение",
  value: TaskType.REDUCTION,
};

const taskTypeOption: { [key in SubjectType]: LabeledValue[] } = {
  [SubjectType.STANDARD_MATH]: [
    proofTaskType,
    computationTaskType,
    reductionTaskType,
  ],
  [SubjectType.COMBINATORICS]: [],
  [SubjectType.COMPLEX_NUMBERS]: [],
  [SubjectType.LOGIC]: [],
  [SubjectType.PHYSICS]: [],
};
