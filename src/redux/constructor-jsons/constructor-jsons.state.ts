import { ConstructorJSONs } from "./constructor-jsons.types";

const CONSTRUCTOR_JSONS_INITIAL_STATE: ConstructorJSONs = {
  namespace: {
    nameEn: "",
    nameRu: "",
    code: "",
    allowEdit: "false",
    allowRead: "true",
    editGrantedUsers: [],
    readGrantedUsers: [],
    taskSetList: [],
  },
  rulePack: {
    code: "",
    nameEn: "",
    nameRu: "",
    namespace: "",
    rulePacks: [],
    rules: [],
  },
  taskSet: {
    code: "",
    nameEn: "",
    nameRu: "",
    namespace: "",
    subjectTypes: "",
    tasks: [],
  },
};

export default CONSTRUCTOR_JSONS_INITIAL_STATE;
