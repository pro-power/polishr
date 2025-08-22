// src/lib/themes/index.ts

import { ColorTheme } from '../templates/template-types'

export const PORTFOLIO_THEMES: Record<string, ColorTheme> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Professional blue tones inspired by the deep sea',
    palette: {
      primary: '#0ea5e9', // sky-500
      secondary: '#06b6d4', // cyan-500
      accent: '#3b82f6', // blue-500
      background: '#ffffff',
      surface: '#f8fafc', // slate-50
      surfaceVariant: '#f1f5f9', // slate-100
      text: {
        primary: '#0f172a', // slate-900
        secondary: '#475569', // slate-600
        muted: '#64748b', // slate-500
        inverse: '#ffffff'
      },
      border: '#e2e8f0', // slate-200
      success: '#10b981', // emerald-500
      warning: '#f59e0b', // amber-500
      error: '#ef4444' // red-500
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace'
    },
    borderRadius: '0.5rem',
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    }
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm and energetic orange-red palette',
    palette: {
      primary: '#f97316', // orange-500
      secondary: '#fb923c', // orange-400
      accent: '#ef4444', // red-500
      background: '#fffbeb', // amber-50
      surface: '#ffffff',
      surfaceVariant: '#fef3c7', // amber-100
      text: {
        primary: '#92400e', // amber-800
        secondary: '#d97706', // amber-600
        muted: '#f59e0b', // amber-500
        inverse: '#ffffff'
      },
      border: '#fde68a', // amber-200
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      heading: 'Poppins, system-ui, sans-serif',
      body: 'Poppins, system-ui, sans-serif',
      mono: 'Fira Code, monospace'
    },
    borderRadius: '0.75rem',
    shadows: {
      sm: '0 1px 2px 0 rgb(251 146 60 / 0.1)',
      md: '0 4px 6px -1px rgb(251 146 60 / 0.15), 0 2px 4px -2px rgb(251 146 60 / 0.1)',
      lg: '0 10px 15px -3px rgb(251 146 60 / 0.2), 0 4px 6px -4px rgb(251 146 60 / 0.1)'
    }
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens promoting growth and stability',
    palette: {
      primary: '#10b981', // emerald-500
      secondary: '#059669', // emerald-600
      accent: '#22c55e', // green-500
      background: '#f0fdf4', // green-50
      surface: '#ffffff',
      surfaceVariant: '#dcfce7', // green-100
      text: {
        primary: '#14532d', // green-900
        secondary: '#166534', // green-800
        muted: '#16a34a', // green-600
        inverse: '#ffffff'
      },
      border: '#bbf7d0', // green-200
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Source Sans Pro, system-ui, sans-serif',
      mono: 'Source Code Pro, monospace'
    },
    borderRadius: '0.375rem',
    shadows: {
      sm: '0 1px 2px 0 rgb(16 185 129 / 0.1)',
      md: '0 4px 6px -1px rgb(16 185 129 / 0.15), 0 2px 4px -2px rgb(16 185 129 / 0.1)',
      lg: '0 10px 15px -3px rgb(16 185 129 / 0.2), 0 4px 6px -4px rgb(16 185 129 / 0.1)'
    }
  },

  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark theme with purple accents for modern developers',
    palette: {
      primary: '#a855f7', // purple-500
      secondary: '#8b5cf6', // violet-500
      accent: '#06b6d4', // cyan-500
      background: '#0f0f23', // Custom dark blue
      surface: '#1e1e2e', // Custom darker
      surfaceVariant: '#2a2a3a', // Custom lighter dark
      text: {
        primary: '#ffffff',
        secondary: '#e2e8f0', // slate-200
        muted: '#94a3b8', // slate-400
        inverse: '#0f172a'
      },
      border: '#374151', // gray-700
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      heading: 'JetBrains Mono, monospace',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    borderRadius: '0.25rem',
    shadows: {
      sm: '0 1px 2px 0 rgb(168 85 247 / 0.2)',
      md: '0 4px 6px -1px rgb(168 85 247 / 0.25), 0 2px 4px -2px rgb(168 85 247 / 0.15)',
      lg: '0 10px 15px -3px rgb(168 85 247 / 0.3), 0 4px 6px -4px rgb(168 85 247 / 0.2)'
    }
  },

  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean black and white with subtle grays',
    palette: {
      primary: '#000000',
      secondary: '#374151', // gray-700
      accent: '#6b7280', // gray-500
      background: '#ffffff',
      surface: '#f9fafb', // gray-50
      surfaceVariant: '#f3f4f6', // gray-100
      text: {
        primary: '#111827', // gray-900
        secondary: '#374151', // gray-700
        muted: '#6b7280', // gray-500
        inverse: '#ffffff'
      },
      border: '#d1d5db', // gray-300
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'IBM Plex Sans, system-ui, sans-serif',
      mono: 'IBM Plex Mono, monospace'
    },
    borderRadius: '0',
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    }
  }
}

export const getTheme = (themeId: string): ColorTheme => {
  return PORTFOLIO_THEMES[themeId] || PORTFOLIO_THEMES.ocean
}

export const getAllThemes = (): ColorTheme[] => {
  return Object.values(PORTFOLIO_THEMES)
}