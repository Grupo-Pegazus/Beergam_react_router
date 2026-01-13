import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";

dayjs.locale("pt-br");

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface MonthYearPickerProps {
  value: Dayjs | null;
  onChange: (date: Dayjs) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  minYear?: number;
  maxYear?: number;
}

export function MonthYearPicker({
  value,
  onChange,
  onClose,
  anchorEl,
  minYear,
  maxYear,
}: MonthYearPickerProps) {
  const [view, setView] = useState<"month" | "year">("month");
  const currentDate = value || dayjs();
  const [selectedYear, setSelectedYear] = useState(() => currentDate.year());

  // Atualiza o ano selecionado quando o valor muda
  useEffect(() => {
    if (value) {
      setSelectedYear(value.year());
    }
  }, [value]);

  const currentYear = dayjs().year();
  const startYear = minYear ?? currentYear - 10;
  const endYear = maxYear ?? currentYear + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = dayjs()
      .year(selectedYear)
      .month(monthIndex)
      .startOf("month");
    onChange(newDate);
    onClose();
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setView("month");
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: 2,
          minWidth: 300,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setView(view === "month" ? "year" : "month")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-beergam-typography-tertiary)",
            }}
          >
            {view === "month" ? `${selectedYear}` : "Selecionar Ano"}
          </Button>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => {
                if (view === "year") {
                  setView("month");
                } else {
                  setSelectedYear(selectedYear - 1);
                }
              }}
              sx={{
                color: "var(--color-beergam-orange)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                ‹
              </Typography>
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                if (view === "year") {
                  setView("month");
                } else {
                  setSelectedYear(selectedYear + 1);
                }
              }}
              sx={{
                color: "var(--color-beergam-orange)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                ›
              </Typography>
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        {view === "month" ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
            }}
          >
            {MONTHS.map((month, index) => {
              const isSelected =
                value?.year() === selectedYear && value?.month() === index;
              return (
                <Button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  sx={{
                    textTransform: "none",
                    padding: "8px 4px",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    backgroundColor: isSelected
                      ? "var(--color-beergam-primary)"
                      : "transparent",
                    color: isSelected
                      ? "var(--color-beergam-white)"
                      : "var(--color-beergam-typography-tertiary)",
                    "&:hover": {
                      backgroundColor: "var(--color-beergam-primary)",
                    },
                  }}
                >
                  {month.slice(0, 3)}
                </Button>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {years.map((year) => {
              const isSelected = year === selectedYear;
              return (
                <Button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  sx={{
                    textTransform: "none",
                    padding: "8px 4px",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    backgroundColor: isSelected
                      ? "var(--color-beergam-primary)"
                      : "transparent",
                    color: isSelected
                      ? "var(--color-beergam-white)"
                      : "var(--color-beergam-typography-tertiary)",
                    "&:hover": {
                      backgroundColor: "var(--color-beergam-primary)",
                    },
                  }}
                >
                  {year}
                </Button>
              );
            })}
          </Box>
        )}
      </Box>
    </Popover>
  );
}
