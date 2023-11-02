import { useReducer, useEffect, useRef, useCallback } from 'react';

type State<T> = {
  status: 'loading' | 'success' | 'error';
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
};

type Action<T> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: T }
  | { type: 'ERROR'; error: Error };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'LOADING': {
      return {
        ...state,
        status: 'loading',
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    }
    case 'SUCCESS': {
      return {
        ...state,
        status: 'success',
        data: action.data,
        isLoading: false,
        isSuccess: true,
        isError: false,
      };
    }
    case 'ERROR': {
      return {
        ...state,
        status: 'error',
        error: action.error,
        isLoading: false,
        isSuccess: false,
        isError: true,
      };
    }
    default: {
      return state;
    }
  }
}

export function useAsyncFn<T>(asyncFn: () => Promise<T>): State<T> {
  const intialState: State<T> = {
    status: 'loading',
    data: undefined,
    error: undefined,
    isLoading: true,
    isSuccess: false,
    isError: false,
    refetch: async () => {},
  };
  const [state, dispatch] = useReducer(reducer<T>, intialState);

  const asyncFnRef = useRef(asyncFn);
  asyncFnRef.current = asyncFn;

  const executeAsyncFn = useCallback(async () => {
    dispatch({ type: 'LOADING' });

    try {
      const data = await asyncFnRef.current();
      dispatch({ type: 'SUCCESS', data });
    } catch (error) {
      dispatch({ type: 'ERROR', error: error as Error });
    }
  }, []);

  useEffect(() => {
    executeAsyncFn();
  }, [executeAsyncFn]);

  return { ...state, refetch: executeAsyncFn };
}
