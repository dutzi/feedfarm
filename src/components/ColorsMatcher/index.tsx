import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Color from 'color';
import colorsPalettes from 'nice-color-palettes';
import randomItem from 'random-item';

export default function ColorsMatcher() {
  const vars = [
    '--feedfarm-primary',
    '--feedfarm-cyan',
    '--page-bg',
    '--page-bg-primary',
    '--post-bg',
    '--post-border-color',
    '--post-entity-border-color',
    '--post-type-button-bg',
    '--post-type-button-color',
    '--text-color-amplified',
    '--text-color-default',
    '--text-color-muted',
    '--post-type-indicator-color',
    '--comment-editor-border-color',
    '--comment-editor-bg-color',
    '--comment-placeholder-color',
    '--input-placeholder-color',
    '--separator-color',
    '--footer-color',
    '--context-menu-color',
    '--context-menu-label-color',
    '--context-menu-highlight-color',
    '--emoji-selected-color',
    '--poll-answer-bg-color',
    '--contrasting-bg',
  ];

  const colors = vars.map(varName => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)!
      .trim();
    const color = Color(value);
    return {
      name: varName,
      color,
      value,
      luminosity: Math.floor(color.luminosity() * 100) / 100,
    };
  });

  // colors.forEach(color => {
  //   const hsl = (color as any).color.hsl().color as number[];
  //   if (hsl[0] === hsl[1] && hsl[0] === 0) {
  //     console.log('grey', color);
  //     const inveretedColor = Color.hsl([1 - hsl[0], 1 - hsl[1], 100 - hsl[2]])
  //       .rgb()
  //       .toString();
  //     document.documentElement.style.setProperty(color.name, inveretedColor);
  //   }
  // });

  function randomize() {
    const palette = randomItem(colorsPalettes as string[][]).concat(
      randomItem(colorsPalettes as string[][]),
    );
    colors.forEach(color => {
      const hsl = (color as any).color.hsl().color as number[];
      document.documentElement.style.setProperty(
        color.name,
        randomItem(palette),
      );
      // if (hsl[0] === hsl[1] && hsl[0] === 0) {
      //   console.log('grey', color);
      //   const inveretedColor = Color.hsl([1 - hsl[0], 1 - hsl[1], 100 - hsl[2]])
      //     .rgb()
      //     .toString();
      //   document.documentElement.style.setProperty(color.name, inveretedColor);
      // }
    });
  }
  randomize();
  (window as any).randomize = randomize;

  return (
    <div className={styles.colorsMatcher}>
      {colors.map((color, index) => (
        <div
          className={styles.color}
          style={{ backgroundColor: color.value, top: index * 50 + 'px' }}
          data-luminosity={color.luminosity}
        ></div>
      ))}
    </div>
  );
}
