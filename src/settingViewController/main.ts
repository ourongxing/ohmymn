import implementDatasourceMethod from "./implementDatasourceMethod"
import handleUserAction from "./handleUserAction"
import lifeCycle from "./lifeCycle"
const inst = {
  ...lifeCycle,
  ...implementDatasourceMethod,
  ...handleUserAction
}

export default inst
