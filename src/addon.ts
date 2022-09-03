import mnaddon from "../mnaddon.json"
const key = mnaddon.addonid.split(".")[2]
export const Addon = {
  path: "",
  isZH: true,
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version,
  key,
  globalProfileKey: `${key}_profile_global_v4`,
  docProfileKey: `${key}_profile_doc_v4`,
  notebookProfileKey: `${key}_profile_notebook_v4`,
  textColor: UIColor.blackColor(),
  borderColor: UIColor.colorWithHexString("#8A95A2"),
  buttonColor: UIColor.colorWithHexString("#8A95A2")
}
