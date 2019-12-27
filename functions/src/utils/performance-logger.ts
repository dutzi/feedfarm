import { ADMIN_UID } from './consts';

export default function createLogger(id: string, uid: string) {
  if (true || uid !== ADMIN_UID) {
    return {
      log: () => {
        return;
      },
      measurePromise: <T>(message: string, promise: Promise<T>) => {
        return promise;
      },
      end: () => {
        return;
      },
    };
  }

  const initDate = new Date();
  let prevDate: Date;

  console.log(`[${id}] started`);

  return {
    log: (message: string) => {
      const now = new Date();

      const fullTime = Math.floor((now.getTime() - initDate.getTime()) / 1000);

      let output = `(${fullTime}s) ${message}`;

      const duration = Math.floor(
        (now.getTime() - (prevDate || initDate).getTime()) / 1000,
      );

      output = `${output} :: took ${duration}s`;

      console.log(`[${id}] ${output}`);

      prevDate = now;
    },

    measurePromise: <T>(message: string, promise: Promise<T>): Promise<T> => {
      const now = new Date();

      promise.then(
        () => {
          const duration = Math.floor(
            (new Date().getTime() - now.getTime()) / 1000,
          );

          console.log(`[${id}] ${message} :: took ${duration}s`);
        },
        () => {
          return;
        },
      );

      return promise;
    },

    end: () => {
      console.log(`[${id}] ended`);
    },
  };
}
