import React, { useState, useEffect } from 'react';
import styles from '../index.module.scss';
import Button from '../../../components/Button';
import { useTranslation, Trans } from 'react-i18next';
import GifIcon from '../../../components/Icons/Gif';

interface IGiphyGif {
  height: string;
  url: string;
  width: string;
}

export interface IGiphyGifRecord {
  thumbnail: IGiphyGif;
  full: IGiphyGif;
}

function useFetchGifs(query: string) {
  const [gifs, setGifs] = useState<IGiphyGifRecord[]>([]);

  useEffect(() => {
    fetch(
      query
        ? `https://api.giphy.com/v1/gifs/search?api_key=nT8JsT1W2eduwlsjCLdVi6ExtBfRMMX4&q=${query}&limit=25&offset=0&rating=R&lang=en`
        : `https://api.giphy.com/v1/gifs/trending?api_key=nT8JsT1W2eduwlsjCLdVi6ExtBfRMMX4&limit=25&rating=R`,
    )
      .then(res => res.json())
      .then(res => {
        setGifs(
          res.data.map((gif: any) => ({
            thumbnail: gif.images.fixed_height_small_still,
            full: gif.images.original,
          })),
        );
      });
  }, [query]);

  return gifs;
}

export default function useGifSelector(
  query: string,
): [
  ({ onClick }: { onClick: () => void }) => JSX.Element,
  (props: {
    handleGifSelected: (gif: IGiphyGifRecord) => void;
  }) => JSX.Element | null,
  boolean,
] {
  const [isShowGifSelector, setIsShowGifSelector] = useState(false);
  const gifs = useFetchGifs(query);
  const { t } = useTranslation();

  function handleToggleSelector() {
    setIsShowGifSelector(!isShowGifSelector);
  }

  function renderButton({ onClick }: { onClick: () => void }) {
    function handleClick() {
      onClick();
      handleToggleSelector();
    }

    return (
      <Button
        variant="ghost"
        svgIcon={isShowGifSelector ? undefined : <GifIcon />}
        label={isShowGifSelector ? t('Cancel') : undefined}
        onClick={handleClick}
        showNewBadge={!isShowGifSelector}
      />
    );
  }

  function renderGifSelector({
    handleGifSelected,
  }: {
    handleGifSelected: (gif: IGiphyGifRecord) => void;
  }) {
    if (!isShowGifSelector) {
      return null;
    }

    function handleClick(gif: IGiphyGifRecord) {
      setIsShowGifSelector(false);
      handleGifSelected(gif);
    }

    return (
      <div className={styles.gifSelector}>
        {gifs.map(gif => (
          <button
            key={gif.thumbnail.url}
            className={styles.gifThumbnail}
            onClick={handleClick.bind(null, gif)}
          >
            <img src={gif.thumbnail.url} />
          </button>
        ))}
        {!gifs.length && (
          <div className={styles.noResults}>{t('No gifs found')}</div>
        )}
      </div>
    );
  }

  return [renderButton, renderGifSelector, isShowGifSelector];
}
