const profileType = {
    ohmymn: {
        rightMode: false,
        doubleClick: false,
        clickHidden: false,
        autoCorrect: false
    },
    autocomplete: {
        on: false,
        fillExplanation: false,
        fillFrequency: false
    },
    autostandardize: {
        on: false,
    },
    anotherautotitle: {
        on: false,
        mergeTitle: false,
        noPunctuation: false,
        isWord: false,
        changeTitleNoLimit: false,
        wordCount: "",
        customTitle: ""
    },
    autolist: {
        on: false,
        multipleChoiceEnhance: false,
        wrapWhenSemicolon: false,
        customList: ""
    },
    autoreplace: {
        on: false,
        customReplace: ""
    }
}

declare type IProfile = typeof profileType
// 为了防止循环引用，可以单独写个脚本生成配置文件，主要是想要有提示
// 话说除了上面这个办法，还能怎么才能根据已有的对象生成类型提示
const profile: { [k: string]: { [k: string]: boolean | string } } & IProfile = {
    ohmymn: {
        rightMode: false,
        doubleClick: false,
        clickHidden: false,
        autoCorrect: false
    },
    autocomplete: {
        on: false,
        fillExplanation: false,
        fillFrequency: false
    },
    autostandardize: {
        on: false,
    },
    anotherautotitle: {
        on: false,
        mergeTitle: false,
        noPunctuation: false,
        isWord: false,
        changeTitleNoLimit: false,
        wordCount: "",
        customTitle: ""
    },
    autolist: {
        on: false,
        multipleChoiceEnhance: false,
        wrapWhenSemicolon: false,
        customList: ""
    },
    autoreplace: {
        on: false,
        customReplace: ""
    }
}

export default profile