import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import cx from 'classnames';
import firebase from 'firebase/app';
import { IUser } from '@feedfarm-shared/types';
import get from 'lodash.get';

interface IPredicate {
  type: '=' | '!=' | '>' | '<' | 'exists';
  leftArg: string;
  rightArg: string;
}

// interface IParseError {
//   error: string;
//   line: number;
// }
const keywordsRegex = /(\.|=|\!=|\n|<|>)/;
const hash: any = {};

function memoizeRegex(str: string) {
  if (hash[str]) return hash[str];
  hash[str] = new RegExp(str, 'gi');
  return hash[str];
}

export default function AdminTools() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState(`status=m.*
age>24
username=xyzdavid`);
  const pre = useRef<HTMLPreElement>(null);

  useEffect(() => {
    firebase
      .firestore()
      .collection('/users')
      // .limit(10)
      .get()
      .then(users => {
        setUsers(
          users.docs
            .map(user => user.data() as IUser)
            .filter(user => !user.isTestUser),
        );
      });
  }, []);

  function doesNotFollowPredicate(user: IUser, predicate: IPredicate): boolean {
    function getOrFallback(user: IUser, path: string) {
      return get(user, path) || '';
    }

    switch (predicate.type) {
      case '=':
        return !String(
          String(getOrFallback(user, predicate.leftArg)).toLowerCase(),
        ).match(new RegExp(predicate.rightArg.toLowerCase()));
      case '!=':
        return !!String(
          String(getOrFallback(user, predicate.leftArg)).toLowerCase(),
        ).match(new RegExp(predicate.rightArg.toLowerCase()));
      case '>':
        return !(
          getOrFallback(user, predicate.leftArg) > Number(predicate.rightArg)
        );
      case '<':
        return !(
          getOrFallback(user, predicate.leftArg) < Number(predicate.rightArg)
        );
      case 'exists':
        return !get(user, predicate.leftArg);
    }
  }

  function createPredicateFromString(
    predicateStr: string,
    index: number,
  ): IPredicate {
    // prettier-ignore
    if (predicateStr.indexOf('!=') > -1) {
      const args = predicateStr.split('!=');
      return { type: '!=', leftArg: args[0].trim(), rightArg: args[1].trim() };
    } else if (predicateStr.indexOf('=') > -1) {
      const args = predicateStr.split('=');
      return { type: '=', leftArg: args[0].trim(), rightArg: args[1].trim() };
    } else if (predicateStr.indexOf('>') > -1) {
      const args = predicateStr.split('>');
      return { type: '>', leftArg: args[0].trim(), rightArg: args[1].trim() };
    } else if (predicateStr.indexOf('<') > -1) {
      const args = predicateStr.split('<');
      return { type: '<', leftArg: args[0].trim(), rightArg: args[1].trim() };
    } else {
      return { type: 'exists', leftArg: predicateStr, rightArg: '' };
    }
  }

  useEffect(() => {
    try {
      if (query === '') {
        setFilteredUsers(users);
        return;
      }

      const predicates = query
        .trim()
        .split('\n')
        .map(predicate => predicate.trim())
        .filter(predicate => predicate && !predicate.startsWith('//'))
        .map(createPredicateFromString);

      const filteredUsers = users.filter(user => {
        return !predicates.find(predicate =>
          doesNotFollowPredicate(user, predicate),
        );
      });
      setFilteredUsers(filteredUsers);
      setError(false);
    } catch (err) {
      setError(true);
      console.error(err);
    }
  }, [query, users]);

  function handleQueryChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuery(e.target.value);
  }

  function highlightJSON(json: string) {
    if (query.trim() === '') return json;

    const args = query
      .split(keywordsRegex)
      .filter(x => !x.match(keywordsRegex))
      .filter(x => x !== '*')
      .filter(x => x);

    return json.replace(
      memoizeRegex(`\\b(${args.join('|')})\\b`),
      `<span class="${styles.highlight}">$1</span>`,
    );
  }

  return (
    <div className={cx(styles.wrapper, !!error && styles.error)}>
      <textarea
        className={styles.textarea}
        value={query}
        onChange={handleQueryChange}
        placeholder="Query"
      />

      {filteredUsers.map((user, index) => (
        <pre ref={pre} className={styles.pre}>
          <div className={styles.metadata}>
            &nbsp;{index + 1} of {filteredUsers.length}
            {' | '}
            <a
              href={`https://console.firebase.google.com/u/1/project/feedfarm-app/database/firestore/data~2Fusers~2F${user.id}`}
              target="_blank"
            >
              {user.id}
            </a>
            {' | '}
            {user.username}
          </div>
          <span
            dangerouslySetInnerHTML={{
              __html: highlightJSON(JSON.stringify(user, null, 4)),
            }}
          />
        </pre>
      ))}
    </div>
  );
}
