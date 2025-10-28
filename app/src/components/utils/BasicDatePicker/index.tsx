import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/pt-br";

// Ativar plugin de parse customizado
dayjs.extend(customParseFormat);

interface BasicDatePickerProps {
  value?: Date | string | Dayjs;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: Date | string | Dayjs;
  name?: string;
}

export default function BasicDatePicker({
  value,
  onChange,
  defaultValue,
  name = "date",
}: BasicDatePickerProps) {
  const handleDateChange = (date: Dayjs | null) => {
    if (onChange && date) {
      const fakeEvent = {
        target: {
          name: name,
          value: date.toISOString(),
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(fakeEvent);
    }
  };

  // Converter valor para dayjs
  const getDayjsValue = (): Dayjs | undefined => {
    if (value) {
      if (value instanceof Date) return dayjs(value);
      if (typeof value === "string") {
        // Tentar com formato DD/MM/YYYY primeiro
        const parsed = dayjs(value, "DD/MM/YYYY", true);
        return parsed.isValid() ? parsed : dayjs(value);
      }
      return value; // já é Dayjs
    }
    if (defaultValue) {
      if (defaultValue instanceof Date) return dayjs(defaultValue);
      if (typeof defaultValue === "string") {
        // Tentar com formato DD/MM/YYYY primeiro
        const parsed = dayjs(defaultValue, "DD/MM/YYYY", true);
        return parsed.isValid() ? parsed : dayjs(defaultValue);
      }
      return defaultValue; // já é Dayjs
    }
    return undefined;
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br"
      localeText={
        ptBR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DatePicker
        disableFuture
        format="DD/MM/YYYY"
        value={getDayjsValue()}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
}
