import { useEffect } from 'react';
import useFeed from './use-feed';

interface ICSSVarsMap {
  [key: string]: string | null;
}

let baseCSSVars: ICSSVarsMap;

function setCSSVar(name: string, value: string | null) {
  document.documentElement.style.setProperty(name, value);
}

function setCSSVars(vars: ICSSVarsMap, isBase?: boolean) {
  Object.keys(vars).forEach(key => setCSSVar(key, vars[key]));

  if (isBase) {
    baseCSSVars = { ...vars };
  } else if (baseCSSVars) {
    const missingVarFromBase = Object.keys(vars).find(
      varName => baseCSSVars[varName] !== null,
    );
    if (missingVarFromBase) {
      console.error('[theme-setter] missing var from base', missingVarFromBase);
    }

    const missingVarFromTheme = Object.keys(baseCSSVars).find(
      varName => typeof vars[varName] !== 'string',
    );
    if (missingVarFromTheme) {
      console.error(
        '[theme-setter] missing var from theme',
        missingVarFromTheme,
      );
    }
  }
}

export default function useThemeSetter() {
  const feed = useFeed();

  useEffect(() => {
    if (feed?.theme === 'default') {
      setCSSVars(
        {
          '--feedfarm-primary': null,
          '--feedfarm-cyan': null,
          '--page-bg': null,
          '--page-bg-primary': null,
          '--page-bg-size': null,
          '--post-bg': null,
          '--post-border-radius': null,
          '--post-border-color': null,
          '--post-entity-border-color': null,
          '--post-padding': null,
          '--floater-border': null,
          '--post-type-button-bg': null,
          '--post-type-button-color': null,
          '--text-color-amplified': null,
          '--text-color-default': null,
          '--text-color-muted': null,
          '--post-type-indicator-color': null,
          '--comment-editor-border-color': null,
          '--comment-editor-bg-color': null,
          '--comment-placeholder-color': null,
          '--input-placeholder-color': null,
          '--separator-color': null,
          '--footer-color': null,
          '--context-menu-color': null,
          '--context-menu-label-color': null,
          '--context-menu-highlight-color': null,
          '--emoji-selected-color': null,
          '--poll-answer-bg-color': null,
          '--contrasting-bg': null,
        },
        true,
      );
    } else if (feed?.theme === 'light') {
      setCSSVars(
        {
          '--feedfarm-primary': '#167aa0',
          '--feedfarm-cyan': '#06b6ff',
          '--page-bg': '#e2e2d8',
          '--page-bg-primary': null,
          '--page-bg-size': null,
          '--post-bg': '#f2f1eb',
          '--post-border-radius': null,
          '--post-border-color': '#727272',
          '--post-entity-border-color': null,
          '--post-padding': null,
          '--floater-border': null,
          '--post-type-button-bg': null,
          '--post-type-button-color': null,
          '--text-color-amplified': '#000000',
          '--text-color-default': '#1a1a1a',
          '--text-color-muted': '#646464',
          '--post-type-indicator-color': null,
          '--comment-editor-border-color': '#727272',
          '--comment-editor-bg-color': '#e7e5dc',
          '--comment-placeholder-color': '#7b7a68',
          '--input-placeholder-color': null,
          '--separator-color': '#7f7f7f',
          '--footer-color': null,
          '--context-menu-color': null,
          '--context-menu-label-color': null,
          '--context-menu-highlight-color': null,
          '--emoji-selected-color': null,
          '--poll-answer-bg-color': null,
          '--contrasting-bg': '#00000024',
        },
        true,
      );
    } else if (feed?.theme === 'bars') {
      setCSSVars({
        '--feedfarm-primary': '#ef01ff',
        '--feedfarm-cyan': '#50fffe',
        '--page-bg': 'linear-gradient(#2196F3 49%, #03A9F4 50%)',
        '--page-bg-primary': '#2196F3',
        '--page-bg-size': '100% 50px',
        '--post-bg': '#3F51B5',
        '--post-type-button-bg': '#2196F3',
        '--post-type-button-color': '#51ffff',
        '--text-color-amplified': '#ffffff',
        '--text-color-default': '#ffffff',
        '--text-color-muted': '#ffffffc2',
        '--post-type-indicator-color': '#3f51b5',
        '--comment-editor-border-color': '#000000',
        '--comment-editor-bg-color': '#2196F3',
        '--comment-placeholder-color': 'var(--post-bg)',
        '--input-placeholder-color': 'var(--post-bg)',
        '--separator-color': '#000000',
        '--footer-color': '#ffffff87',
        '--context-menu-color': '#2196F3',
        '--context-menu-label-color': '#ffffff',
        '--context-menu-highlight-color': '#ffffff',
        '--emoji-selected-color': '',
        '--poll-answer-bg-color': '#2196F3',
        '--contrasting-bg': '#ffffff24',
      });
    } else if (feed?.theme === 'messages') {
      setCSSVars({
        '--feedfarm-primary': '#ef01ff',
        '--feedfarm-cyan': '#50fffe',
        '--page-bg': '#ffffff',
        '--page-bg-primary': '#ffffff',
        '--page-bg-size': '100% 50px',
        '--post-bg': '#4299f8',
        '--post-border-radius': '12px',
        '--post-border-color': 'transparent',
        '--post-entity-border-color': '#ffffff',
        '--post-padding': '20px',
        '--floater-border': 'none',
        '--post-type-button-bg': '#2196F3',
        '--post-type-button-color': '#51ffff',
        '--text-color-amplified': '#ffffff',
        '--text-color-default': '#ffffff',
        '--text-color-muted': '#ffffffc2',
        '--post-type-indicator-color': '#d6d6d6',
        '--comment-editor-border-color': '#000000',
        '--comment-editor-bg-color': '#2196F3',
        '--comment-placeholder-color': 'var(--post-bg)',
        '--input-placeholder-color': 'var(--post-bg)',
        '--separator-color': '#000000',
        '--footer-color': '#ffffff87',
        '--context-menu-color': '#2196F3',
        '--context-menu-label-color': '#ffffff',
        '--context-menu-highlight-color': '#ffffff',
        '--emoji-selected-color': '',
        '--poll-answer-bg-color': '#2196F3',
        '--contrasting-bg': '#ffffff24',
      });
    } else if (feed?.theme === 'notebook') {
      setCSSVars({
        '--page-bg': 'linear-gradient(white 49%, #4299f8 50%, white 51%)',
      });
    }
  }, [feed?.theme]);
}
