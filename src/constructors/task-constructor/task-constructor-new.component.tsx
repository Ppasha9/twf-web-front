// libs and hooks
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
// custom constants
// redux
import { connect, ConnectedProps } from "react-redux";
import { updateTaskSetJSON } from "../../redux/constructor-jsons/constructor-jsons.actions";
// context
import { TasksFieldArrayActionsContext } from "../task-set-constructor/task-set-constructor.component";
// custom components
import ActionButton from "../../components/action-button/action-button.component";
import ConstructorForm from "../../components/constructor-form/constructor-form";
// types
import { ActionButtonProps } from "../../components/action-button/action-button.types";
import { TaskConstructorProps } from "./task-constructor.types";
import { ConstructorJSONType } from "../../redux/constructor-jsons/constructor-jsons.types";
import { TaskSetConstructorInputs } from "../task-set-constructor/task-set-constructor.types";
import { ConstructorFormInput } from "../../components/constructor-form/constructor-form.types";
// icons
import Icon from "@mdi/react";
import {
  mdiArrowDown,
  mdiArrowExpandLeft,
  mdiArrowExpandRight,
  mdiArrowUp,
  mdiClose,
  mdiContentCopy,
  mdiFileEye,
  mdiPlayCircle,
  mdiRobot,
  mdiWrench,
} from "@mdi/js";
// styles
import "./task-constructor.styles.scss";
import { addMultipleLinesChangeToHistory } from "../../redux/constructor-history/constructor-history.actions";
import ConstructorPanelsForm from "../../components/constructor-panels-form/constructor-panels-form";
import { getFields } from "../../components/constructor-fields/constructor-fields";
import { formPanels } from "../../components/constructor-fields/constructor-fields.data";

const TaskConstructorNew = ({
  // task constructor props
  index,
  defaultValue,
  isRendered,
  visualizationMode,
  rulePacks,
  // redux props
  updateTaskSetJSON,
  addMultipleLinesChangeToHistory,
}: TaskConstructorProps & ConnectedProps<typeof connector>): JSX.Element => {
  const { taskCreationType } = defaultValue;

  // react-hook-form core functions from parent component's context
  // TaskConstructor should be wrapped inside FormProvider component
  const { getValues, watch, setValue } = useFormContext();


  // react-hook-form array-field functions
  // @ts-ignore
  const {append: appendTask, swap: swapTask, remove: removeTask,
  } = React.useContext(TasksFieldArrayActionsContext);

  const [showAddFields, setShowAddFields] = useState(false);

  const panels = formPanels;

  const inputs: ConstructorFormInput[] = getFields(
    index,
    watch,
    setValue,
    rulePacks
  );

  const manualTaskBasicInputsNames = [
    "nameEn",
    "nameRu",
    "code",
    "descriptionShortRu",
    "descriptionShortEn",
    "subjectType",
    "rulePacks",
    "originalExpression",
    "goalType",
    "goalExpression",
    "goalNumberProperty",
    "goalPattern",
    // helpers inputs
    "startExpression",
    "taskType",
    "sign",
    "computationGoalType",
    "numType",
    "countAnswers",
    "concreteAnswers",
    "maxWeight",
    "reductionGoalType",
    "minMultipliers",
    "varsList",
    "tags",
  ];

  const autoTaskBasicInputsNames = [
    "nameEn",
    "nameRu",
    "code",
    "operations",
    "subjectTypes",
    "stepsCountInterval",
    "implicitTransformationsCount",
    "autoGeneratedRulePacks",
  ];

  // get basic inputs
  const [manualTaskBasicInputs, autoTaskBasicInputs] = [
    manualTaskBasicInputsNames,
    autoTaskBasicInputsNames,
  ].map((basicInputNames: string[]) => {
    return inputs.filter((input: ConstructorFormInput) => {
      const prefix = `tasks[${index}].`;
      const { name } = input;
      return (
        (input.isRendered === undefined || input.isRendered) &&
        basicInputNames.includes(name.replace(prefix, ""))
      );
    });
  });

  // get additional inputs
  const [manualTasksAddInputs, autoTasksAddInputs] = [
    manualTaskBasicInputs,
    autoTaskBasicInputs,
  ].map((basicInputs: ConstructorFormInput[]) => {
    return inputs
      .filter((input: ConstructorFormInput) => {
        return (
          (input.isRendered === undefined || input.isRendered) &&
          !basicInputs.includes(input)
        );
      })
      .map((input: ConstructorFormInput) => {
        return {
          ...input,
          isVisible:
            input.isVisible === undefined
              ? showAddFields
              : input.isVisible && showAddFields,
        };
      });
  });

  const updateTasks = async (action: () => Promise<void>) => {
    const oldValue = await getValues();
    await action();
    const newValue = await getValues();

    console.log(`oldValue: ${JSON.stringify(oldValue)}`);
    console.log(`newValue: ${JSON.stringify(newValue)}`);

    // @ts-ignore
    addMultipleLinesChangeToHistory(oldValue, getValues());
    // @ts-ignore
    updateTaskSetJSON(getValues());
  };
  const tableActionButtonsLeft: ActionButtonProps[] = [
    {
      mdiIconPath: mdiContentCopy,
      size: 1.5,
      async action() {
        await updateTasks(async () => {
          await appendTask({
            taskCreationType: taskCreationType,
            ...getValues().tasks[index],
          });
        });
      },
    },
    {
      mdiIconPath: mdiArrowUp,
      size: 1.5,
      async action() {
        if (index !== 0) {
          await updateTasks(async () => {
            await swapTask(index, index - 1);
          });
        }
      },
    },
    {
      mdiIconPath: mdiArrowDown,
      size: 1.5,
      async action() {
        if (index !== getValues().tasks.length - 1) {
          await updateTasks(async () => {
            await swapTask(index, index + 1);
          });
        }
      },
    },
  ];

  const tableActionButtonsRight: ActionButtonProps[] = [
    {
      mdiIconPath: mdiClose,
      size: 2,
      async action() {
        if (window.confirm(`Вы точно хотите удалить уровень ${index + 1}?`)) {
          await updateTasks(async () => await removeTask(index));
        }
      },
    },
    {
      mdiIconPath: mdiFileEye,
      size: 2,
      action() {},
    },
    {
      mdiIconPath: mdiPlayCircle,
      size: 2,
      action() {},
    },
  ];
  const listTopActionButtons: ActionButtonProps[] = tableActionButtonsLeft
    .concat(tableActionButtonsRight)
    .map((item: ActionButtonProps) => {
      return { ...item, size: 1.5 };
    });

  const isTable = (): boolean => visualizationMode === "table";

  if (!isRendered) {
    if (isTable()) {
      return (
        <div className="task-constructor-table">
          {tableActionButtonsLeft.map((button: ActionButtonProps) => {
            return (
              <div
                key={button.mdiIconPath}
                className="task-constructor-table__icon"
              >
                <ActionButton {...button} />
              </div>
            );
          })}
          <div className="task-constructor-table__icon">{index + 1}.</div>
          <div className="task-constructor-table__icon">
            <Icon
              path={taskCreationType === "auto" ? mdiRobot : mdiWrench}
              size={2}
            />
          </div>
          <ConstructorForm
            inputs={
              taskCreationType === "auto"
                ? autoTaskBasicInputs.concat(autoTasksAddInputs)
                : manualTaskBasicInputs.concat(manualTasksAddInputs)
            }
            constructorType={ConstructorJSONType.TASK_SET}
            showUndoRedoPanel={false}
            className="task-constructor-table__inputs"
          />
          <div className="task-constructor-table__icon">
            <ActionButton
              mdiIconPath={
                showAddFields ? mdiArrowExpandLeft : mdiArrowExpandRight
              }
              size={2}
              action={() => setShowAddFields(!showAddFields)}
            />
          </div>
          {tableActionButtonsRight.map((button: ActionButtonProps) => {
            return (
              <div
                key={button.mdiIconPath}
                className="task-constructor-table__icon"
              >
                <ActionButton {...button} />
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="task-constructor-list">
          <div className="task-constructor-list__top-action-buttons">
            {listTopActionButtons.map(
              (button: ActionButtonProps, i: number) => {
                return <ActionButton key={i} {...button} />;
              }
            )}
          </div>

          <ConstructorPanelsForm
            inputs={inputs}
            panels={panels}
            constructorType={ConstructorJSONType.TASK_SET}
            showUndoRedoPanel={false}
            className="d-flex flex-wrap align-items-end"
          />
        </div>
      );
    }
  } else {
    return <></>;
  }
};

// connecting redux
const mapDispatchToProps = (dispatch: any) => ({
  updateTaskSetJSON: (taskSetJSON: TaskSetConstructorInputs) =>
    dispatch(updateTaskSetJSON(taskSetJSON)),
  addMultipleLinesChangeToHistory: (
    oldVal: TaskSetConstructorInputs,
    newVal: TaskSetConstructorInputs
  ) =>
    dispatch(
      addMultipleLinesChangeToHistory({
        oldVal,
        newVal,
        constructorType: ConstructorJSONType.TASK_SET,
      })
    ),
});

const connector = connect(null, mapDispatchToProps);

export default connector(TaskConstructorNew);
