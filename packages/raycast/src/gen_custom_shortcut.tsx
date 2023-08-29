import {
  Action,
  ActionPanel,
  Clipboard,
  confirmAlert,
  environment,
  Form,
  getPreferenceValues,
  Icon,
  launchCommand,
  LaunchType,
  open,
  showHUD
} from "@raycast/api"
import { randomUUID } from "crypto"
import { useEffect, useRef, useState } from "react"
import {
  cardActions,
  defaultRequiredCardActions,
  defaultRequiredTextActions,
  readLocalShortcuts,
  textActions,
  writeLocalShortcuts
} from "./store"
import {
  CustomShortcut,
  LocalShortcut,
  OhMyMNAction,
  Preferences
} from "./typings"

const preferences = getPreferenceValues<Preferences>()
const username = preferences.username ?? "anonymous"

function popupEnptyError(value: string) {
  if (value === "") return "Can not be empty"
}

let uuid = ""
export default function ({
  draftValues
}: {
  draftValues?: CustomShortcut.Form
}) {
  const passedForm = environment.launchContext?.form ?? draftValues
  const [type, setType] = useState<string>(passedForm?.type ?? "card")
  const [num, setNum] = useState<string>(passedForm?.num ?? "1")
  const [desc, setDesc] = useState<string>(passedForm?.desc ?? "")
  const [allActions, setAllActions] = useState<OhMyMNAction[]>(
    type === "card" ? cardActions : textActions
  )
  const [requiredActions, setRequiredActions] = useState<
    CustomShortcut.Action[]
  >(function getInitialState() {
    return (
      draftValues?.type === "text"
        ? defaultRequiredTextActions
        : defaultRequiredCardActions
    ).map((k, i) => {
      if (passedForm?.[`action_${i}` as keyof CustomShortcut.Form]) {
        return {
          key: passedForm[`action_${i}` as keyof CustomShortcut.Form]!,
          input:
            passedForm[`action_input_${i}` as keyof CustomShortcut.Form] ?? "",
          desc:
            passedForm[`action_input_desc_${i}` as keyof CustomShortcut.Form] ??
            ""
        }
      }
      return k
    })
  })

  const isMounted = useRef(true)

  useEffect(() => {
    if (!isMounted.current) {
      setAllActions(type === "card" ? cardActions : textActions)
      setNum("1")
      setRequiredActions(
        type === "card"
          ? defaultRequiredCardActions
          : defaultRequiredTextActions
      )
    }
  }, [type])

  useEffect(() => {
    isMounted.current = false
  }, [])

  async function generate(form: CustomShortcut.Form) {
    const moduleNames = new Set<string>()
    const actionNames = [] as string[]
    const detailItems = [] as {
      actionName: string
      input?: string
      desc?: string
    }[]

    const actions = Array.from({ length: Number(form.num) }).map((_, i) => {
      const [need_input, key, option, name, moduleName] =
        form[`action_${i}` as keyof CustomShortcut.Form]!.split("_")
      actionNames.push(name)
      if (!moduleName.startsWith("Magic")) moduleNames.add(moduleName)
      if (need_input === "true") {
        const input = form[
          `action_input_${i}` as keyof CustomShortcut.Form
        ]!.replace(/\n/g, "\\n")
        const desc =
          form[`action_input_desc_${i}` as keyof CustomShortcut.Form]!
        detailItems.push({
          actionName: name,
          input,
          desc
        })
        return {
          action: key,
          type: form.type,
          content: input,
          option
        }
      } else {
        detailItems.push({
          actionName: name
        })
        return {
          action: key,
          type: form.type,
          option
        }
      }
    })

    if (uuid === "") {
      if (moduleNames.size === 1)
        await confirmAlert({
          title: "This Shortcut will use a optional module",
          icon: { source: "logo.png" },
          message: `It is ${
            [...moduleNames][0]
          }. Make sure you have turned on it.`
        })
      if (moduleNames.size > 1)
        await confirmAlert({
          title: "This Shortcut will use some optional modules",
          icon: { source: "logo.png" },
          message: `They are ${[...moduleNames].join(
            ", "
          )}. Make sure you have turned on them.`
        })
    }

    function genDetail() {
      const { actionInChinese } = preferences
      const _option = actionInChinese ? "选项" : "Option"
      const _input = actionInChinese ? "输入" : "Input"
      const _desc = actionInChinese ? "描述" : "Description"
      return detailItems
        .map((k, i) => {
          const [action, option] = k.actionName.split(" / ")
          if (k.input) {
            if (k.desc) {
              return `## ${desc}

**${i + 1}、${action}**

**${_option}**：${option}

**${_input}**：
\`\`\`text
${k.input}
\`\`\`
**${_desc}**：${k.desc}`
            } else {
              return `## ${desc}

**${i + 1}、${action}**

**${_option}**: ${option}

**${_input}**:
\`\`\`text
${k.input}
\`\`\``
            }
          } else {
            return `## ${desc}

**${i + 1}、${action}**

**${_option}**：${option}`
          }
        })
        .join("\n\n")
    }

    if (!uuid) {
      uuid = environment.launchContext?.uuid
      uuid = uuid ? uuid : randomUUID()
    }
    return {
      detail: genDetail(),
      moduleNames: [...moduleNames],
      url: `marginnote3app://addon/ohmymn?actions=${encodeURIComponent(
        JSON.stringify(actions)
      )}`
    }
  }

  async function save2local(
    form: CustomShortcut.Form,
    url: string,
    detail: string,
    moduleNames: string[]
  ) {
    const temp = await readLocalShortcuts()
    if (temp) {
      const shortcuts = JSON.parse(temp as string) as LocalShortcut[]
      const existIndex = shortcuts.findIndex(k => k.uuid === uuid)
      if (existIndex === -1) {
        shortcuts.unshift({
          form,
          url,
          moduleNames,
          author: username,
          detail,
          uuid,
          createdTime: Date.now(),
          modifiedTime: Date.now()
        })
      } else {
        shortcuts[existIndex] = {
          ...shortcuts[existIndex],
          form,
          url,
          detail,
          moduleNames,
          modifiedTime: Date.now()
        }
      }
      await writeLocalShortcuts(shortcuts)
    } else {
      const shortcuts = [
        {
          form,
          url,
          moduleNames,
          detail,
          author: username,
          modifiedTime: Date.now(),
          createdTime: Date.now(),
          uuid
        }
      ] as LocalShortcut[]
      await writeLocalShortcuts(shortcuts)
    }
  }

  function ActionDropdown({ num }: { num: number }) {
    const action = requiredActions[num]
    return (
      <>
        <Form.Dropdown
          id={`action_${num}`}
          title={`Action ${num + 1}`}
          value={action.key}
          onChange={value => {
            setRequiredActions(
              requiredActions.map((k, i) =>
                i === num ? { ...k, input: "", desc: "", key: value } : { ...k }
              )
            )
          }}
        >
          {allActions.map(action => (
            <Form.Dropdown.Section title={action.label} key={action.key}>
              {action.option.map((option, i) => {
                const title = `${action.label} / ${option}`
                const value = `${
                  action.type === 2 || /(?:使用|Use) Auto\w+/.test(option)
                    ? "false"
                    : "true"
                }_${action.key}_${i}_${title}_${action.moduleName}`
                return (
                  <Form.Dropdown.Item
                    key={value}
                    title={title}
                    value={value}
                    icon={{
                      source: `icon/${action.key}.png`
                    }}
                  />
                )
              })}
            </Form.Dropdown.Section>
          ))}
        </Form.Dropdown>
        {action.key.startsWith("true") && (
          <>
            <Form.TextArea
              id={`action_input_${num}`}
              title={`Action ${num + 1} Require Input`}
              value={action.input}
              error={popupEnptyError(action.input)}
              onChange={value => {
                setRequiredActions(
                  requiredActions.map((k, i) =>
                    i === num ? { ...k, input: value } : { ...k }
                  )
                )
              }}
            />
            <Form.TextArea
              id={`action_input_desc_${num}`}
              title="Describe what you input"
              value={action.desc}
              onChange={value => {
                setRequiredActions(
                  requiredActions.map((k, i) =>
                    i === num ? { ...k, desc: value } : { ...k }
                  )
                )
              }}
            />
          </>
        )}
      </>
    )
  }

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Test"
            onSubmit={async (form: CustomShortcut.Form) => {
              const { url } = await generate(form)
              open(url)
            }}
          />
          <Action.SubmitForm
            title="Generate and View"
            onSubmit={async (form: CustomShortcut.Form) => {
              const { url, detail, moduleNames } = await generate(form)
              await save2local(form, url, detail, moduleNames)
              launchCommand({
                name: "find_custom_shortcuts",
                type: LaunchType.UserInitiated
              })
            }}
          />
          <Action.SubmitForm
            title="Generate and Copy Link"
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            onSubmit={async (form: CustomShortcut.Form) => {
              const { url, detail, moduleNames } = await generate(form)
              await save2local(form, url, detail, moduleNames)
              await Clipboard.copy(url)
              showHUD("Copied to Clipboard")
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="desc"
        title="Description"
        value={desc}
        error={popupEnptyError(desc)}
        onChange={setDesc}
      />
      <Form.Dropdown id="type" title="Type" value={type} onChange={setType}>
        <Form.Dropdown.Item
          value="card"
          title="Card Actions"
          icon={Icon.AppWindow}
        />
        <Form.Dropdown.Item
          value="text"
          title="Text Actions"
          icon={Icon.Text}
        />
      </Form.Dropdown>

      <Form.Dropdown
        id="num"
        title="Number of Actions"
        value={num}
        onChange={setNum}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Form.Dropdown.Item
            key={i}
            value={String(i + 1)}
            title={String(i + 1)}
          />
        ))}
      </Form.Dropdown>

      {requiredActions.slice(0, Number(num)).map((_, i) => (
        <ActionDropdown key={i} num={i} />
      ))}
    </Form>
  )
}
