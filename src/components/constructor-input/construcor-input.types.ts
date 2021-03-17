import { Dispatch } from "react";
import { HistoryItem } from "../../constructors/task-constructor/task-constructor.component";
import {
  ConstructorHistoryItem,
  ExpressionChange,
} from "../../redux/constructor-history/constructor-history.types";
import { ConstructorJSONType } from "../../redux/constructor-jsons/constructor-jsons.types";

export interface ConstructorInputProps {
  name: string;
  type: string;
  disabled?: boolean;
  register?: (...args: any) => void;
  label?: string;
  isRendered?: boolean;
  isVisible?: boolean;
  defaultValue?: any;
  expressionInput?: boolean;
  onChange?: (...args: any) => any;
  // updateJSON?: () => void;
  addToHistory?: (oldVal: ExpressionChange, newVal: ExpressionChange) => void;
  constructorType: ConstructorJSONType;
}
