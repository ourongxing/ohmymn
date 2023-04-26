import contributorNames from "../../../contributors.json"

export interface Contributor {
  name: string
  avatar: string
}

export interface SocialEntry {
  icon: string
  link: string
}

export interface CoreTeam {
  avatar: string
  name: string
  // required to download avatars from GitHub
  github: string
  twitter: string
  sponsor?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
}

const contributorsAvatars: Record<string, string> = {}

const getAvatarUrl = (name: string) =>
  import.meta.hot
    ? `https://github.com/${name}.png`
    : `/user-avatars/${name}.png`

export const contributors = (contributorNames as string[]).reduce(
  (acc, name) => {
    contributorsAvatars[name] = getAvatarUrl(name)
    acc.push({ name, avatar: contributorsAvatars[name] })
    return acc
  },
  [] as Contributor[]
)
