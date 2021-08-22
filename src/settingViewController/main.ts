import implementDatasourceMethod from "./implementDatasourceMethod";
import handleUserAction from "./handleUserAction";
import lifeCycle from "./lifeCycle";
const inst: InstMembers = {
  ...lifeCycle,
  ...implementDatasourceMethod,
  ...handleUserAction
}
// 迷惑行为，我直接导出 controller 不行，只能导出 inst，不然不会执行 inst 的方法，找了半天 bug
export default inst