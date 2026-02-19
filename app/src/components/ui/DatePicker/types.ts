import type { Dayjs } from "dayjs";

/** Modos do DatePicker - cada um com responsabilidade única (SRP) */
export type DatePickerMode = "full" | "date-range" | "single-day" | "single-month";

/** Valor para modo full: intervalo com data/hora ISO */
export interface DatePickerFullValue {
  start: string;
  end: string;
}

/** Valor para modo date-range: intervalo apenas datas */
export interface DatePickerDateRangeValue {
  start: string;
  end: string;
}

/** Valor único: string em formato compatível com o modo */
export type DatePickerSingleValue = string;

/** Union de todos os valores possíveis */
export type DatePickerValue =
  | DatePickerFullValue
  | DatePickerDateRangeValue
  | DatePickerSingleValue;

/** Props base compartilhadas (OCP - aberto para extensão) */
export interface DatePickerBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  widthType?: "fit" | "full";
  className?: string;
  defaultOpen?: boolean;
}

/** Props para modo full */
export interface DatePickerFullProps extends DatePickerBaseProps {
  mode: "full";
  value?: DatePickerFullValue | null;
  onChange: (value: DatePickerFullValue) => void;
}

/** Props para modo date-range */
export interface DatePickerDateRangeProps extends DatePickerBaseProps {
  mode: "date-range";
  value?: DatePickerDateRangeValue | null;
  onChange: (value: DatePickerDateRangeValue) => void;
}

/** Props para modo single-day */
export interface DatePickerSingleDayProps extends DatePickerBaseProps {
  mode: "single-day";
  value?: DatePickerSingleValue | null;
  onChange: (value: string) => void;
  includeTime?: boolean;
}

/** Props para modo single-month */
export interface DatePickerSingleMonthProps extends DatePickerBaseProps {
  mode: "single-month";
  value?: DatePickerSingleValue | null;
  onChange: (value: string) => void;
}

/** Union de todas as props */
export type DatePickerProps =
  | DatePickerFullProps
  | DatePickerDateRangeProps
  | DatePickerSingleDayProps
  | DatePickerSingleMonthProps;

/** Estado interno do calendário para seleção de range */
export interface CalendarRangeState {
  start: Dayjs | null;
  end: Dayjs | null;
  selecting: "start" | "end";
}
