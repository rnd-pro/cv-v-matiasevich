/// <reference types="jsda-kit/types" />

declare module 'symbiote-ui/themes/Theme.js' {
  export function applyTheme(element: HTMLElement, theme: { tokens: Record<string, string>; extraCSS?: string; name?: string }): void;
  export function applyCascadeTheme(element: HTMLElement, options?: {
    mode?: 'dark' | 'light';
    brightness?: number;
    contrast?: number;
    chroma?: number;
    hue?: number;
    outline?: number;
    type?: number;
    density?: number;
  }): {
    name: string;
    state: Record<string, string | number>;
    tokens: Record<string, string>;
  };
}

declare module 'symbiote-ui/themes/cascade-theme.js' {
  export type CascadeThemeMode = 'dark' | 'light';
  export type CascadeThemeOptions = {
    mode?: CascadeThemeMode;
    brightness?: number;
    contrast?: number;
    chroma?: number;
    hue?: number;
    outline?: number;
    type?: number;
    density?: number;
  };
  export type CascadeThemeResult = {
    name: string;
    state: Record<string, string | number>;
    tokens: Record<string, string>;
  };
  export const CASCADE_THEME_DEFAULTS: Required<CascadeThemeOptions>;
  export function createCascadeTheme(options?: CascadeThemeOptions): CascadeThemeResult;
  export function applyCascadeTheme(element: HTMLElement, options?: CascadeThemeOptions): CascadeThemeResult;
}

declare module 'symbiote-ui/canvas/NodeCanvas/NodeCanvas.js';
declare module 'symbiote-ui/layout/CrossLayoutPortalBridge/CrossLayoutPortalBridge.js';
declare module 'symbiote-ui/layout/Layout/Layout.js';
declare module 'symbiote-ui/node/GraphFrame/GraphFrame.js';
declare module 'symbiote-ui/node/GraphNode/GraphNode.js';
