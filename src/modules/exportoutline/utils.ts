import { lang } from "./lang"
import type { IConfig, ICheckMethod, MbBookNote, MNPic } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { ActionKey } from "./enum"
import { getExcerptText } from "@/utils/note"
import { openUrl } from "@/utils/common"
import { showHUD } from "@/utils/common"
import { getAncestorNodes, getNodeTree, getAllCommnets } from "@/utils/note"
import { privateEncrypt } from "crypto"
import { escapeURLParam } from "@/utils"
import { config, listenerCount } from "process"
import { profile } from "console"
import { MN } from "@/const"

export function getExcerptNotes(node: MbBookNote) {
  return node.comments.reduce((acc, cur) => {
    // console.log(cur,"export2devonthink")
    cur.type == "TextNote" &&
      cur.text.startsWith("marginnote3app://note/") &&
      acc.push(`[[#^${cur.text.split("note/")[1]}|🔗]]`)
    return acc
  }, [] as string[])
}

export function getAllText(
  node: MbBookNote,
  separator = "\n",
  highlight = true,
  mdsize = ""
) {
  // console.log(utils.getExcerptNotes(node),"export2devonthink")
  return [
    ...getExcerptText(node, highlight, mdsize).md,
    ...getAllCommnets(node, mdsize).md,
    ...getExcerptNotes(node),
    `[](marginnote3app://note/${node.noteId})`,
    `^${node.noteId}`
  ]
    .join("\n")
    .replace(/\n/g, separator)
}

export function getAllOCR(
  node: MbBookNote,
  separator = "\n",
  highlight = true,
  mdsize = ""
) {
  // console.log(utils.getExcerptNotes(node),"export2devonthink")
  return [
    ...getExcerptText(node, highlight, mdsize).ocr,
    ...getAllCommnets(node, mdsize).nopic,
    ...getExcerptNotes(node),
    `[](marginnote3app://note/${node.noteId})`,
    `^${node.noteId}`
  ]
    .join("\n")
    .replace(/\n/g, separator)
}

export function makeObsidianOutline(
  node: MbBookNote,
  method: number,
  imgprocess: number,
  mdsize = ""
) {
  if (imgprocess == 0) {
    if (method == 0) {
      let res = node.noteTitle
        ? "- " +
          node.noteTitle +
          "\n" +
          getAllText(node, "\n", false, mdsize) +
          "\n"
        : "- " + getAllText(node, "\n", false, mdsize) + "\n"
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllText(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length),
          true,
          mdsize
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    } else if (method == 1) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      // console.log(parentNotes,"export2devonthink")

      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllText(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllText(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true,
            mdsize
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllText(node, "\n" + "  ".repeat(parentNotes.length), true, mdsize)
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllText(node, "\n" + "  ".repeat(parentNotes.length), true, mdsize)
      }
      return res
    } else if (method == 2) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      console.log("qweqweq", "export2devonthink")
      console.log(parentNotes[0], "export2devonthink")
      console.log(parentNotes[parentNotes.length - 1], "export2devonthink")
      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllText(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllText(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true,
            mdsize
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllText(
            node,
            "\n" + "  ".repeat(parentNotes.length),
            true,
            mdsize
          ) +
          "\n"
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllText(
            node,
            "\n" + "  ".repeat(parentNotes.length),
            true,
            mdsize
          ) +
          "\n"
      }

      const indent = parentNotes.length
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllText(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length + indent),
          true,
          mdsize
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length + indent) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    }
  } else if (imgprocess == 1) {
    if (method == 0) {
      let res = node.noteTitle
        ? "- " +
          node.noteTitle +
          "\n" +
          getAllOCR(node, "\n", false, mdsize) +
          "\n"
        : "- " + getAllOCR(node, "\n", false, mdsize) + "\n"
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllOCR(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length),
          true,
          mdsize
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    } else if (method == 1) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      // console.log(parentNotes,"export2devonthink")

      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllOCR(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllOCR(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true,
            mdsize
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllOCR(node, "\n" + "  ".repeat(parentNotes.length), true, mdsize)
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllOCR(node, "\n" + "  ".repeat(parentNotes.length), true, mdsize)
      }
      return res
    } else if (method == 2) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      // console.log(parentNotes,"export2devonthink")

      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllOCR(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true,
              mdsize
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllOCR(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true,
            mdsize
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllOCR(
            node,
            "\n" + "  ".repeat(parentNotes.length),
            true,
            mdsize
          ) +
          "\n"
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllOCR(
            node,
            "\n" + "  ".repeat(parentNotes.length),
            true,
            mdsize
          ) +
          "\n"
      }

      const indent = parentNotes.length
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllOCR(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length + indent),
          true,
          mdsize
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length + indent) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    }
  }
}
