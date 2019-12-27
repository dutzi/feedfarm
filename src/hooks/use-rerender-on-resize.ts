import {useState, useEffect} from 'react';


export default function useRerenderOnResize() {
  const [, setSomeState] = useState([0, 0]);
  useEffect(() => {
    function handleResize() {
      setSomeState([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}

