import { lang } from "./lang"
import type { IConfig, ICheckMethod, MbBookNote, MNPic } from "typings"
import { CellViewType } from "typings/enum"
import { IDocProfile, IProfile } from "profile"
import { ActionKey } from "./enum"
import { getExcerptText} from "utils/note"
import { openUrl } from "utils/common"
import { showHUD } from "utils/common"
import { getAncestorNodes,getNodeTree,  getAllCommnets } from "utils/note"
import { privateEncrypt } from "crypto"
import { escapeURLParam } from "utils"
import { config, listenerCount } from "process"
import { profile } from "console"
import { MN } from "const"
const { link, intro, lable, option, help } = lang

const configs: IConfig<(IProfile & IDocProfile)["exportoutline"], typeof ActionKey> = {
  name: "Export Outline",
  key: "exportoutline",
  intro,
  link,
  settings: [
    {
      type: CellViewType.Select,
      key:"contentMethod",
      option:["导出包含其所有子节点", "导出包含其所有父节点","导出包含其所有父子节点"],
      label:"导出内容"
    },
    {
      type: CellViewType.Select,
      key: "imgprocess",
      option: ["导出图片", "转为文字"],
      label: "图片处理方式",
      // bind: [["exportMethod", 0]] 
    },
    {
      type: CellViewType.InlineInput,
      key: "imgsize",
      label: "图片大小",
      help: "单位：px",
      bind: [["imgprocess", 0]]
    },
    {
      type: CellViewType.Input,
      key: "vault",
      help: "保险库名",
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.Input,
      key: "fileName",
      help: "要创建的文件名",
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.Select,
      key: "writeMethod",
      option: ["无","追加", "覆盖"],
      label:"写入方式",
      // bind: [["exportMethod", 0]]
    }
    
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportOutline2app",
      label: "导出大纲",
      method: async ({ nodes, option }) => {
        let allText = ""
        for (const node of nodes){
            const exportText = utils.makeObsidianOutline(node,self.profile.exportoutline.contentMethod[0],self.profile.exportoutline.imgprocess[0],`pic.png|${self.profile.exportoutline.imgsize}`)
            allText += exportText+"\n"
        }
        // console.log("success","export2devonthink")
        // console.log(allText,"export2devonthink")
        if(self.profile.exportoutline.writeMethod[0] == 0){
          if(allText){
            const obsURL = "obsidian://new?vault=" + encodeURIComponent(self.profile.exportoutline.vault) + 
            "&name=" + encodeURIComponent(self.profile.exportoutline.fileName) + 
            "&content=" +encodeURIComponent(allText) 
            MN.app.openURL(NSURL.URLWithString(obsURL))
          }
          else showHUD("没有选择任何一张卡片")
        }
        else if(self.profile.exportoutline.writeMethod[0] == 1){
          if(allText){
            const obsURL = "obsidian://new?vault=" + encodeURIComponent(self.profile.exportoutline.vault) + 
            "&name=" + encodeURIComponent(self.profile.exportoutline.fileName) + 
            "&content=" +encodeURIComponent(allText) +"&append"
            MN.app.openURL(NSURL.URLWithString(obsURL))
          }
          else showHUD("没有选择任何一张卡片")
        }
        else if(self.profile.exportoutline.writeMethod[0] == 2){
          if(allText){
            const obsURL = "obsidian://new?vault=" + encodeURIComponent(self.profile.exportoutline.vault) + 
            "&name=" + encodeURIComponent(self.profile.exportoutline.fileName) + 
            "&content=" +encodeURIComponent(allText) +"&overwrite"
            MN.app.openURL(NSURL.URLWithString(obsURL))
          }
          else showHUD("没有选择任何一张卡片")
        }
      }
    }
  ],
  actions4text: [
    // {
    //   type: CellViewType.Button,
    //   key: "action4Text",
    //   label: "",
    //   option: [],
    //   method: ({ text, option }) => {
    //     console.log("")
    //   }
    // }
  ]
}

const utils = {
  getExcerptNotes : (node: MbBookNote): string[] => {
    return node.comments.reduce(
      (acc, cur) => {
        // console.log(cur,"export2devonthink")
        cur.type == "TextNote"  &&cur.text.startsWith("marginnote3app://note/") && acc.push(`[[#^${cur.text.split("note/")[1]}|🔗]]`)
        return acc
      },
      [] as string[]
    )
  },
  getAllText : (node: MbBookNote, separator = "\n", highlight = true, mdsize = "") => {
    // console.log(utils.getExcerptNotes(node),"export2devonthink")
    return [
      ...getExcerptText(node, highlight,mdsize).md,
      ...getAllCommnets(node,mdsize).md,
      ...utils.getExcerptNotes(node),
      `[](marginnote3app://note/${node.noteId})`,
      `^${node.noteId}`
    ].join("\n").replace(/\n/g,separator)
  },
  getAllOCR : (node: MbBookNote, separator = "\n", highlight = true, mdsize = "") => {
    // console.log(utils.getExcerptNotes(node),"export2devonthink")
    return [
      ...getExcerptText(node, highlight,mdsize).ocr,
      ...getAllCommnets(node,mdsize).nopic,
      ...utils.getExcerptNotes(node),
      `[](marginnote3app://note/${node.noteId})`,
      `^${node.noteId}`
    ].join("\n").replace(/\n/g,separator)
  },
  makeObsidianOutline : (node:MbBookNote,method:number,imgprocess:number,mdsize = "") =>{
    if(imgprocess == 0 ){
      if (method == 0){
        let res =node.noteTitle?"- "+  node.noteTitle+ "\n" + utils.getAllText(node, "\n", false,mdsize) + "\n":"- " + utils.getAllText(node, "\n", false,mdsize) + "\n"
        const { treeIndex, onlyChildren } = getNodeTree(node)
        // console.log(treeIndex,"export2devonthink")
        for(let i=0;i<onlyChildren.length;i++){
          // console.log(treeIndex[i],"export2devonthink")
          const titleAndcomment = utils.getAllText(onlyChildren[i],"\n"+"  ".repeat(treeIndex[i].length),true,mdsize)
          if(onlyChildren[i].noteTitle){
            res = res+ "  ".repeat(treeIndex[i].length)+ "- "+onlyChildren[i].noteTitle +"\n" +  "  ".repeat(treeIndex[i].length) + titleAndcomment + "\n"
          }
          else {res = res + "  ".repeat(treeIndex[i].length)+"- "+titleAndcomment +"\n"}
        }
        return res
      }
      else if (method == 1){
        const parentNotes = getAncestorNodes(node)
        let res = ""
        // console.log(parentNotes,"export2devonthink")
        
        for(let i=0; i<parentNotes.length; i++){
          if(i==0){
            const groupNoteID = parentNotes[parentNotes.length-i-1].groupNoteId
            const newNote = MN.db.getNoteById(groupNoteID!)
            if(newNote && newNote.noteTitle){
              const titleAndcomment = utils.getAllText(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+ "  ".repeat(i)+ "- "+newNote.noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else if(newNote){
              const titleAndcomment = utils.getAllText(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+  "  ".repeat(i) +"- "+ titleAndcomment + "\n"
            }
            else {
              const titleAndcomment = utils.getAllText(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
              res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"
            }
          }
          else{
            const titleAndcomment = utils.getAllText(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
            if(parentNotes[parentNotes.length-i-1].noteTitle){
              res = res+ "  ".repeat(i)+ "- "+parentNotes[parentNotes.length-i-1].noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else {res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"}
          }
        }


        if(node.noteTitle){
          res = res + "  ".repeat(parentNotes.length)+ "- "+node.noteTitle +"\n" +  "  ".repeat(parentNotes.length) + utils.getAllText(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)
        }
        else{res = res + "  ".repeat(parentNotes.length)+"- "+ utils.getAllText(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)}
        return res 
      }
      else if(method == 2){
        const parentNotes = getAncestorNodes(node)
        let res = ""
        console.log("qweqweq","export2devonthink")
        console.log(parentNotes[0],"export2devonthink")
        console.log(parentNotes[parentNotes.length-1],"export2devonthink")
        for(let i=0; i<parentNotes.length; i++){
          if(i==0){
            const groupNoteID = parentNotes[parentNotes.length-i-1].groupNoteId
            const newNote = MN.db.getNoteById(groupNoteID!)
            if(newNote && newNote.noteTitle){
              const titleAndcomment = utils.getAllText(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+ "  ".repeat(i)+ "- "+newNote.noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else if(newNote){
              const titleAndcomment = utils.getAllText(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+  "  ".repeat(i) +"- "+ titleAndcomment + "\n"
            }
            else {
              const titleAndcomment = utils.getAllText(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
              res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"
            }
          }
          else{
            const titleAndcomment = utils.getAllText(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
            if(parentNotes[parentNotes.length-i-1].noteTitle){
              res = res+ "  ".repeat(i)+ "- "+parentNotes[parentNotes.length-i-1].noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else {res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"}
          }
        }

        if(node.noteTitle){
          res = res + "  ".repeat(parentNotes.length)+ "- "+node.noteTitle +"\n" +  "  ".repeat(parentNotes.length) + utils.getAllText(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)+"\n"
        }
        else{res = res + "  ".repeat(parentNotes.length)+"- "+ utils.getAllText(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)+"\n"}

        const indent = parentNotes.length
        const { treeIndex, onlyChildren } = getNodeTree(node)
        // console.log(treeIndex,"export2devonthink")
        for(let i=0;i<onlyChildren.length;i++){
          // console.log(treeIndex[i],"export2devonthink")
          const titleAndcomment = utils.getAllText(onlyChildren[i],"\n"+"  ".repeat(treeIndex[i].length+indent),true,mdsize)
          if(onlyChildren[i].noteTitle){
            res = res+ "  ".repeat(treeIndex[i].length+indent)+ "- "+onlyChildren[i].noteTitle +"\n" +  "  ".repeat(treeIndex[i].length+indent) + titleAndcomment + "\n"
          }
          else {res = res + "  ".repeat(treeIndex[i].length+indent)+"- "+titleAndcomment +"\n"}
        }
        return res
      }
    }
    else if(imgprocess == 1 ){
      if (method == 0){
        let res =node.noteTitle?"- "+  node.noteTitle+ "\n" + utils.getAllOCR(node, "\n", false,mdsize) + "\n":"- " + utils.getAllOCR(node, "\n", false,mdsize) + "\n"
        const { treeIndex, onlyChildren } = getNodeTree(node)
        // console.log(treeIndex,"export2devonthink")
        for(let i=0;i<onlyChildren.length;i++){
          // console.log(treeIndex[i],"export2devonthink")
          const titleAndcomment = utils.getAllOCR(onlyChildren[i],"\n"+"  ".repeat(treeIndex[i].length),true,mdsize)
          if(onlyChildren[i].noteTitle){
            res = res+ "  ".repeat(treeIndex[i].length)+ "- "+onlyChildren[i].noteTitle +"\n" +  "  ".repeat(treeIndex[i].length) + titleAndcomment + "\n"
          }
          else {res = res + "  ".repeat(treeIndex[i].length)+"- "+titleAndcomment +"\n"}
        }
        return res
      }
      else if (method == 1){
        const parentNotes = getAncestorNodes(node)
        let res = ""
        // console.log(parentNotes,"export2devonthink")
        
        for(let i=0; i<parentNotes.length; i++){
          if(i==0){
            const groupNoteID = parentNotes[parentNotes.length-i-1].groupNoteId
            const newNote = MN.db.getNoteById(groupNoteID!)
            if(newNote && newNote.noteTitle){
              const titleAndcomment = utils.getAllOCR(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+ "  ".repeat(i)+ "- "+newNote.noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else if(newNote){
              const titleAndcomment = utils.getAllOCR(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+  "  ".repeat(i) +"- "+ titleAndcomment + "\n"
            }
            else {
              const titleAndcomment = utils.getAllOCR(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
              res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"
            }
          }
          else{
            const titleAndcomment = utils.getAllOCR(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
            if(parentNotes[parentNotes.length-i-1].noteTitle){
              res = res+ "  ".repeat(i)+ "- "+parentNotes[parentNotes.length-i-1].noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else {res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"}
          }
        }

        if(node.noteTitle){
          res = res + "  ".repeat(parentNotes.length)+ "- "+node.noteTitle +"\n" +  "  ".repeat(parentNotes.length) + utils.getAllOCR(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)
        }
        else{res = res + "  ".repeat(parentNotes.length)+"- "+ utils.getAllOCR(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)}
        return res 
      }
      else if(method == 2){

        const parentNotes = getAncestorNodes(node)
        let res = ""
        // console.log(parentNotes,"export2devonthink")
        
        for(let i=0; i<parentNotes.length; i++){
          if(i==0){
            const groupNoteID = parentNotes[parentNotes.length-i-1].groupNoteId
            const newNote = MN.db.getNoteById(groupNoteID!)
            if(newNote && newNote.noteTitle){
              const titleAndcomment = utils.getAllOCR(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+ "  ".repeat(i)+ "- "+newNote.noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else if(newNote){
              const titleAndcomment = utils.getAllOCR(newNote,"\n"+"  ".repeat(i),true,mdsize)
              res = res+  "  ".repeat(i) +"- "+ titleAndcomment + "\n"
            }
            else {
              const titleAndcomment = utils.getAllOCR(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
              res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"
            }
          }
          else{
            const titleAndcomment = utils.getAllOCR(parentNotes[parentNotes.length-i-1],"\n"+"  ".repeat(i),true,mdsize)
            if(parentNotes[parentNotes.length-i-1].noteTitle){
              res = res+ "  ".repeat(i)+ "- "+parentNotes[parentNotes.length-i-1].noteTitle +"\n" +  "  ".repeat(i) + titleAndcomment + "\n"
            }
            else {res = res + "  ".repeat(i)+"- "+titleAndcomment +"\n"}
          }
        }

        if(node.noteTitle){
          res = res + "  ".repeat(parentNotes.length)+ "- "+node.noteTitle +"\n" +  "  ".repeat(parentNotes.length) + utils.getAllOCR(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)+"\n"
        }
        else{res = res + "  ".repeat(parentNotes.length)+"- "+ utils.getAllOCR(node,"\n"+"  ".repeat(parentNotes.length),true,mdsize)+"\n"}

        const indent = parentNotes.length
        const { treeIndex, onlyChildren } = getNodeTree(node)
        // console.log(treeIndex,"export2devonthink")
        for(let i=0;i<onlyChildren.length;i++){
          // console.log(treeIndex[i],"export2devonthink")
          const titleAndcomment = utils.getAllOCR(onlyChildren[i],"\n"+"  ".repeat(treeIndex[i].length+indent),true,mdsize)
          if(onlyChildren[i].noteTitle){
            res = res+ "  ".repeat(treeIndex[i].length+indent)+ "- "+onlyChildren[i].noteTitle +"\n" +  "  ".repeat(treeIndex[i].length+indent) + titleAndcomment + "\n"
          }
          else {res = res + "  ".repeat(treeIndex[i].length+indent)+"- "+titleAndcomment +"\n"}
        }
        return res
      }
    }
   
  }
}


const checker: ICheckMethod<
  PickByValue<(IProfile & IDocProfile)["exportoutline"], string>
> = (input, key) => {
  switch (key) {
    default:
      return false
  }
}

const exportoutline = { configs, utils, checker }
export default exportoutline
