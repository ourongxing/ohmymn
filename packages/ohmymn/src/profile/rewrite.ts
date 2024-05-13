import type { RewriteCase } from "./typings"

export const rewriteSelection: RewriteCase[] = [
  {
    version: {
      from: "4.0.0",
      to: ">=4.0.6"
    },
    global: {
      addon: {
        quickSwitch: old => old.map(k => k + 1),
        panelPosition: old => [old[0] >= 1 ? old[0] + 2 : old[0]],
        cardAction: old => {
          const t = old[0]
          let n = t
          if (t >= 5) n += 2
          if (t >= 18) n += 2
          return [n]
        },
        textAction: old => [old[0] >= 10 ? old[0] + 1 : old[0]]
      },
      autoformat: {
        preset: old => old.map(k => (k > 1 ? k - 1 : k))
      }
    }
  },
  {
    version: {
      // 空格
      from: "4.0.6 - 4.0.9",
      to: ">=4.0.10"
    },
    global: {
      addon: {
        removeExcerpt: old => [old[0] === 2 ? 0 : old[0]]
      }
    }
  },
  {
    version: {
      from: "4.0.10",
      to: ">=4.0.11"
    },
    global: {
      autocomment: {
        preset: old => old.filter(k => k !== 1)
      }
    }
  },
  {
    version: {
      from: "4.0.11 - 4.0.13",
      to: ">=4.0.14"
    },
    global: {
      addon: {
        cardAction: old => [old[0] > 0 ? old[0] + 1 : old[0]],
        textAction: old => [old[0] > 0 ? old[0] + 1 : old[0]]
      }
    }
  },
  {
    version: {
      from: "4.0.14 - 4.0.15",
      to: ">=4.0.16"
    },
    global: {
      addon: {
        cardAction: old => [old[0] >= 56 ? old[0] + 1 : old[0]]
      }
    }
  },
  {
    version: {
      from: "4.0.16",
      to: ">=4.1.0"
    },
    global: {
      addon: {
        panelControl: old =>
          old.filter(k => k !== 1).map(k => (k > 1 ? k - 1 : k)),
        textAction: old => [old[0] === 2 ? 3 : old[0] === 3 ? 2 : old[0]]
      }
    }
  },
  {
    version: {
      from: "4.1.1",
      to: ">=4.2.0"
    },
    global: {
      addon: {
        cardAction: old => [old[0] >= 26 ? old[0] + 1 : old[0]]
      }
    }
  },
  {
    version: {
      from: "4.2.1 - 4.3.0",
      to: ">=4.3.1"
    },
    global: {
      addon: {
        quickSwitch: old => old.map(k => (k > 1 ? k + 1 : k))
      }
    }
  },
  {
    version: {
      from: "4.3.2 - 4.3.3",
      to: ">=4.4.0"
    },
    global: {
      ai: {
        // 只剩下 0,2
        model: old => [old[0] === 1 ? 0 : old[0] === 3 ? 2 : old[0]]
      }
    }
  }
]
