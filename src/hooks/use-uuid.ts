import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from './../state/reducer';
import uuidv1 from 'uuid/v1';

export default function useUUID() {
  const storeUUID = useSelector((state: IState) => state.static.uuid);
  const [localStorageUUID, setLocalStorageUUID] = useState<string>();
  const dispatch = useDispatch();

  useEffect(() => {
    const uuid = window.localStorage.getItem('uuid');
    if (uuid) {
      setLocalStorageUUID(uuid);
      dispatch({ type: 'set-uuid', payload: { uuid } });
    } else if (!storeUUID) {
      const newUUID = uuidv1();
      dispatch({ type: 'set-uuid', payload: { uuid: newUUID } });
      window.localStorage.setItem('uuid', newUUID);
    }
  }, []);

  return storeUUID || localStorageUUID;
}
