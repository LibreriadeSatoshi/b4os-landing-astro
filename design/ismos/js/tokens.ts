// GENERATED from design/ismos/tokens.json. Do not edit by hand.
// For non-CSS contexts (emails, canvas, OG images, React Native). In CSS use the variables.
export const ismos = {
  "color": {
    "mauveine": "#4D01E0",
    "indigo": "#2A2550",
    "paper": "#FFFFFF",
    "logwood": "#251D3A",
    "ink": "#000000",
    "madder": "#FF7700",
    "weld": "#FFD23F",
    "logwood-800": "#544281",
    "madder-800": "#8B3D00",
    "mauveine-300": "#9293FF",
    "mauveine-200": "#BFC3FF",
    "logwood-50": "#F8F6FE",
    "logwood-100": "#EFECFD",
    "logwood-200": "#DFD8FB",
    "logwood-300": "#CABDF7",
    "logwood-400": "#AF9BEC",
    "logwood-500": "#9F87E1",
    "logwood-600": "#8369C4",
    "logwood-700": "#6B55A2",
    "logwood-900": "#453867",
    "logwood-950": "#251D3A"
  },
  "semantic": {
    "surface": {
      "light": "{paper}",
      "hacker": "{ink}"
    },
    "surface-raised": {
      "light": "{logwood-50}",
      "hacker": "{logwood}"
    },
    "text": {
      "light": "{ink}",
      "hacker": "{paper}"
    },
    "text-heading": {
      "light": "{ink}",
      "hacker": "{paper}"
    },
    "text-muted": {
      "light": "{logwood-800}",
      "hacker": "{logwood-200}"
    },
    "hairline": {
      "light": "{logwood-200}",
      "hacker": "{logwood-700}"
    },
    "rule-strong": {
      "light": "{ink}",
      "hacker": "{paper}"
    },
    "link": {
      "light": "{mauveine}",
      "hacker": "{mauveine-200}"
    },
    "link-hover": {
      "light": "{logwood-800}",
      "hacker": "{paper}"
    },
    "alert": {
      "light": "{madder-800}",
      "hacker": "{madder}"
    },
    "bar": {
      "light": "{mauveine}",
      "hacker": "{mauveine-300}"
    },
    "track": {
      "light": "{logwood-200}",
      "hacker": "{logwood-700}"
    },
    "action": {
      "light": "{ink}",
      "hacker": "{mauveine}"
    },
    "on-action": {
      "light": "{paper}",
      "hacker": "{paper}"
    },
    "highlight": {
      "light": "{weld}",
      "hacker": "{weld}"
    },
    "on-highlight": {
      "light": "{ink}",
      "hacker": "{ink}"
    },
    "focus": {
      "light": "{mauveine}",
      "hacker": "{weld}"
    },
    "status-info": {
      "light": "{logwood-800}",
      "hacker": "{logwood-200}"
    },
    "status-info-bg": {
      "light": "{logwood-50}",
      "hacker": "{logwood}"
    },
    "status-success": {
      "light": "{indigo}",
      "hacker": "{mauveine-200}"
    },
    "status-warning-bg": {
      "light": "{weld}",
      "hacker": "{weld}"
    },
    "status-warning": {
      "light": "{ink}",
      "hacker": "{ink}"
    },
    "status-error": {
      "light": "{madder-800}",
      "hacker": "{madder}"
    },
    "border-input": {
      "light": "{logwood-700}",
      "hacker": "{logwood-400}"
    },
    "border-strong": {
      "light": "{ink}",
      "hacker": "{paper}"
    },
    "scrim": {
      "light": "rgba(0,0,0,0.48)",
      "hacker": "rgba(0,0,0,0.48)"
    }
  },
  "font": {
    "serif": "Literata, \"Noto Serif SC\", \"Noto Serif JP\", \"Noto Naskh Arabic\", \"Noto Serif Devanagari\", \"Noto Serif Bengali\", Georgia, serif",
    "sans": "\"IBM Plex Sans\", \"IBM Plex Sans Arabic\", \"IBM Plex Sans Devanagari\", \"IBM Plex Sans SC\", \"IBM Plex Sans JP\", \"Noto Sans Bengali\", system-ui, sans-serif",
    "mono": "\"IBM Plex Mono\", ui-monospace, Menlo, monospace",
    "wordmark": "\"Bricolage Grotesque\", sans-serif"
  },
  "space": {
    "space-2": "2px",
    "space-4": "4px",
    "space-8": "8px",
    "space-12": "12px",
    "space-16": "16px",
    "space-24": "24px",
    "space-32": "32px",
    "space-48": "48px",
    "space-64": "64px",
    "space-96": "96px"
  },
  "radius": {
    "radius-0": "0px",
    "radius-4": "4px",
    "radius-8": "8px",
    "radius-circle": "50%"
  },
  "shadow": {
    "shadow-float": "0 2px 8px rgba(0,0,0,0.10)",
    "shadow-modal": "0 8px 24px rgba(0,0,0,0.16)"
  },
  "breakpoint": {
    "bp-sm": "0px",
    "bp-md": "640px",
    "bp-lg": "1024px",
    "bp-xl": "1280px"
  },
  "layout": {
    "content-max": "1200px",
    "gutter": "24px",
    "page-margin": "32px",
    "page-margin-mobile": "16px",
    "reading-column": "680px",
    "tap-target": "44px"
  }
} as const;
export type IsmosColor = keyof typeof ismos.color;
