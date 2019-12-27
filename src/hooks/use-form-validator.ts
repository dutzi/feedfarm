import React, { useEffect, useRef } from 'react';

export default function useFormValidator(fields: { [key: string]: string }) {
  const refs: React.RefObject<{ [key: string]: React.RefObject<any> }> = useRef(
    {},
  );

  useEffect(() => {
    Object.keys(fields).forEach(key => {
      refs.current![key] = React.createRef<any>();
    });
  }, []);

  function checkValidity() {
    let isInvalid;

    Object.keys(refs.current!).forEach(key => {
      if (fields[key].trim() === '' && refs.current![key].current) {
        refs.current![key].current?.popAlert();
        isInvalid = true;
      }
    });

    return isInvalid;
  }

  function hideAlert() {
    Object.keys(refs.current!).forEach(key => {
      refs.current![key].current?.hideAlert();
    });
  }

  return { refs: refs.current!, checkValidity, hideAlert };
}
