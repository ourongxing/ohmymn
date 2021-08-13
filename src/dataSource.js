const DataSource = JSB.defineClass('DataSource : NSObject')
DataSource.prototype.init = () => [
    {
      addonName: 'OhMyMN',
      addonSetting: [
        {
          type: 'display',
          label: 'Github 投票征集新的需求\nMade By @ourongxing（点击跳转）'
        }, {
          type: 'switch',
          label: '面板置于右侧',
          key: 'rightMode',
        }, {
          type: 'switch',
          label: '双击打开面板',
          key: 'doubleClick',
        },
      ]
    },
    {
      addonName: 'Shortcuts',
      addonSetting: [
        {
          type: 'display',
          label: '请注意，以下功能均为选中卡片后点击操作\n使用方法点我查看，与后续板块相呼应'
        }, {
          type: 'switch',
          label: '点击后自动关闭面板',
          key: 'clickHidden',
        }, {
          type: 'button',
          label: '序列化摘录',
          key: 'listChecked',
        }, {
          type: 'button',
          label: '补全单词词形', key: 'completeChecked',
        }, {
          type: 'button',
          label: '填充单词解释',
          key: 'fillChecked',
        }, {
          type: 'button',
          label: '规范摘录和标题',
          key: 'standardizeChecked',
        }, {
          type: 'button',
          label: '切换摘录或标题',
          key: 'switchTitleorExcerpt',
        }, {
          type: 'buttonWithInput',
          label: '批量重命名标题',
          key: 'renameChecked',
          help: '%s 代表原标题',
        }, {
          type: 'buttonWithInput',
          label: '批量替换摘录文字',
          key: 'replaceChecked',
          help: `参考 JS 的 replace 语法\n格式：("匹配","替换");()`,
        }, {
          type: 'buttonWithInput',
          label: '改变所有摘录颜色',
          key: 'changeColorChecked',
          help: '输入颜色索引，也就是顺序，从 1 开始',
        }, {
          type: 'buttonWithInput',
          label: '改变所有摘录填充',
          help: '输入填充索引，也就是顺序，从 1 开始',
          key: 'changeFillChecked',
        },
      ]
    },
    {
      addonName: 'AutoStandardize',
      addonSetting: [
        {
          type: 'display',
          label: '按照排版规范来优化摘录以及标题'
        }, {
          type: 'switch',
          label: '摘录时自动执行',
          key: 'on',
        }, {
          type: 'switch',
          label: '默认使用中文标点符号',
          key: 'defaultChinese',
        }
      ]
    },
    {
      addonName: 'AutoComplete',
      addonSetting: [
        {
          type: 'display',
          label: '补全单词词形，只支持动词和名词\n需要配合AnotherAutoTitle 使用'
        }, {
          type: 'switch',
          label: '摘录时自动执行',
          key: 'on',
        }, {
          type: 'display',
          label: '覆盖小学到托福词汇'
        }, {
          type: 'switch',
          label: '填充单词解释',
          key: 'fillExplanation',
        },
      ]
    },
    {
      addonName: 'AnotherAutoTitle',
      addonSetting: [
        {
          type: 'display',
          label: '更强大的自动转换标题插件'
        }, {
          type: 'switch',
          label: '摘录时自动执行',
          key: 'on',
        }, {
          type: 'switch',
          label: '满足条件的摘录合并标题',
          key: 'mergeTitle',
        }, {
          type: 'display',
          label: '以下情况会在摘录时自动转换为标题'
        }, {
          type: 'switch',
          label: '不含有点号',
          key: 'noPunctuation',
        }, {
          type: 'input',
          label: '字数不超过',
          key: 'wordCount',
          content: '10'
        }, {
          type: 'display',
          label: '自定义正则表达式，无视上述规则\n格式：(/正则/);(/正则/)'
        }, {
          type: 'lineInput',
          key: 'customInput',
        }
      ]
    },
    {
      addonName: 'AutoReplace',
      addonSetting: [
        {
          type: 'display',
          label: '使用正则匹配替换摘录中的某些错误'
        }, {
          type: 'switch',
          key: 'on',
          label: '摘录时自动执行',
        }, {
          type: 'display',
          label: `参考 JS 的 replace 语法\n格式：("匹配","替换");();`
        }, {
          type: 'lineInput',
          key: 'customInput',
        },
      ]
    },
    {
      addonName: 'AutoList',
      addonSetting: [
        {
          type: 'display',
          label: '针对序列文本，自动换行以及补充序号或分号'
        }, {
          type: 'switch',
          key: 'on',
          label: '摘录时自动执行',
        },
      ]
    },
  ]

