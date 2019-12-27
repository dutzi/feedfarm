import { useEffect } from 'react';
import firebase from 'firebase/app';
import { useTypedDispatch, useTypedSelector } from '../state/reducer';
import { useRouteMatch } from 'react-router-dom';
import { IFeed } from '@feedfarm-shared/types';

// let hasRequestedData = false;

export default function useFeed() {
  const feed = useTypedSelector(state => state.feed.feed);

  return feed;
}
