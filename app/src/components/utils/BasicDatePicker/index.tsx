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
  value?: Date | string | Dayjs | null | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: Date | string | Dayjs | null | undefined;
  name?: string;
}

export default function BasicDatePicker({
  value,
  onChange,
  defaultValue,
  name = "date",
}: BasicDatePickerProps) {
  const handleDateChange = (date: Dayjs | null) => {
    if (!onChange) return;

    // Se for nulo ou inválido, envia vazio
    if (!date || !date.isValid()) {
      const fakeEvent = {
        target: {
          name: name,
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(fakeEvent);
      return;
    }

    const fakeEvent = {
      target: {
        name: name,
        // Use ISO normalizado para evitar "Invalid Date" e problemas de timezone
        value: date.startOf("day").toISOString(),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  // Converter valor para dayjs | null (MUI espera null para "sem valor")
  const getDayjsValue = (): Dayjs | null => {
    const toDayjs = (
      v: Date | string | Dayjs | null | undefined
    ): Dayjs | null => {
      if (v == null) return null;

      if (v instanceof Date) {
        const d = dayjs(v);
        return d.isValid() ? d : null;
      }

      if (typeof v === "string") {
        // Tentar DD/MM/YYYY primeiro
        const parsed = dayjs(v, "DD/MM/YYYY", true);
        if (parsed.isValid()) return parsed;

        const fallback = dayjs(v);
        return fallback.isValid() ? fallback : null;
      }

      // Já é Dayjs
      return v.isValid() ? v : null;
    };

    const converted = toDayjs(value);
    if (converted !== null) return converted;

    return toDayjs(defaultValue);
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
        value={getDayjsValue()} // garante null quando vazio/inválido
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
}
