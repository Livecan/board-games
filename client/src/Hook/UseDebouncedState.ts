import React, { Dispatch, SetStateAction, useState } from "react";
import { useDebounce } from "usehooks-ts";

const useDebouncedState = <S extends any>(
  initialValue: S | (() => S), delay?: number
): [S, Dispatch<SetStateAction<S>>, S] => {
  const [value, setValue] = useState<S>(initialValue);
  const debouncedValue = useDebounce<S>(value, delay);

  return [debouncedValue, setValue, value];
};

export default useDebouncedState;
