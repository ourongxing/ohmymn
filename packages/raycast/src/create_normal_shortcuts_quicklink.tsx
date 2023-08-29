import { Action, ActionPanel, List } from "@raycast/api"

const shortcuts = [
  {
    title: "Card Shortcuts",
    shortcuts: Array.from({ length: 8 }).map((_, i) => ({
      title: `Card Shortcut ${i + 1}`,
      link: `marginnote3app://addon/ohmymn?type=card&shortcut=${i + 1}`
    }))
  },
  {
    title: "Card Shortcuts",
    shortcuts: Array.from({ length: 4 }).map((_, i) => ({
      title: `Text Shortcut ${i + 1}`,
      link: `marginnote3app://addon/ohmymn?type=text&shortcut=${i + 1}`
    }))
  }
]

export default function () {
  return (
    <List>
      {shortcuts.map((list, i) => (
        <List.Section key={i} title={list.title}>
          {list.shortcuts.map((shortcut, j) => (
            <List.Item
              icon={`number-0${j + 1}-16`}
              key={shortcut.link}
              title={shortcut.title}
              accessories={[{ text: shortcut.link }]}
              actions={
                <ActionPanel>
                  <Action.CreateQuicklink
                    quicklink={{
                      link: shortcut.link,
                      application: "QReader.MarginStudyMac",
                      name: "OhMyMN | " + shortcut.title
                    }}
                  />
                  <Action.CopyToClipboard
                    title="Copy URL"
                    content={shortcut.link}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  )
}
