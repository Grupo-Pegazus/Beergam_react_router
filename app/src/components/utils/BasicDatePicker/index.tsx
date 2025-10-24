import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "@mui/x-date-pickers/locales";

export default function BasicDatePicker() {
  return (
    <LocalizationProvider
      localeText={
        ptBR.components.MuiLocalizationProvider.defaultProps.localeText
      }
      dateAdapter={AdapterDayjs}
    >
      <p>
        {JSON.stringify(
          ptBR.components.MuiLocalizationProvider.defaultProps.localeText
        )}
      </p>
      <DatePicker
        localeText={
          ptBR.components.MuiLocalizationProvider.defaultProps.localeText
        }
      />
    </LocalizationProvider>
  );
}
