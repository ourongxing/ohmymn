import mainfest from "../manifest"

class MNADDON {
  path!: string
  readonly key = mainfest.key
  readonly title = mainfest.title
  readonly author = mainfest.author
  readonly version = mainfest.version
  readonly github = mainfest.github
  readonly forum = MN.isZH ? mainfest.forumZH : mainfest.forum
  readonly doc = MN.isZH ? mainfest.docZH : mainfest.doc
}

export const Addon = new MNADDON()
