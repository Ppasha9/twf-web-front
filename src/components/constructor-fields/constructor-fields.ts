import {ConstructorFormInput} from "../constructor-form/constructor-form.types";
import {SubjectType} from "../../constructors/constants/constants";
import {getSubjectTaskTypeFields} from "./subject-task-type-fields";
import {getEssenceFields} from "./essence-fields";
import {ComputationGoalType, ReductionGoalType, TaskType} from "./constructor-fields.type";

export const getFields = (index: number, watch: any) : ConstructorFormInput[] => {
  const subjectType: SubjectType = watch(`tasks[${index}].subjectType`);
  const taskType: TaskType = watch(`tasks[${index}].taskType`);
  const computationalGoalType: ComputationGoalType = watch(`tasks[${index}].computationGoalType`);
  const reductionGoalType: ReductionGoalType = watch(`tasks[${index}].reductionGoalType`);
  let inputs = [
    ...getSubjectTaskTypeFields(subjectType),
    ...getEssenceFields(subjectType, taskType, computationalGoalType, reductionGoalType)
  ]

  return inputs.map(input => {
    if (!input.name.includes(`tasks[${index}].`)) {
      input.name = `tasks[${index}].${input.name}`;
    }
    return input;
  });
}