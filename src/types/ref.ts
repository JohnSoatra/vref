export type ChangeEvent = {
  target: any;
  action: string | symbol;
  key: any;
  value: any;
  prevValue: any;
}

export type OnChange = (event: ChangeEvent) => void;

export type Ref<T> = {
  value: T;
  onchange: OnChange | undefined;
};

export type Changes = {
  latest: number;
  tick: number;
  scheduled: boolean;
}
