// import { Paper } from "@mui/material";
// import dayjs, { type Dayjs } from "dayjs";
// import "dayjs/locale/pt-br";
// import { useState } from "react";
// import { MenuConfig, type MenuKeys } from "~/features/menu/typings";
// import type { IColab } from "~/features/user/typings/Colab";
// import { FilterDatePicker } from "~/src/components/filters";

// type ScreenTimeData = {
//   date: string;
//   screens: Record<string, number>; // screen key -> minutes
// };

// type ColabStatsProps = {
//   colab: IColab;
// };

// // Função para formatar tempo em horas e minutos
// function formatDuration(minutes: number): string {
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   if (hours > 0 && mins > 0) {
//     return `${hours}h${mins}m`;
//   } else if (hours > 0) {
//     return `${hours}h`;
//   } else {
//     return `${mins}m`;
//   }
// }

// // Mock de dados de tempo por tela (substituir por dados reais depois)
// function getMockScreenTimeData(): ScreenTimeData[] {
//   const screens = Object.keys(MenuConfig) as MenuKeys[];
//   const data: ScreenTimeData[] = [];

//   // Gerar dados para os últimos 30 dias
//   for (let i = 0; i < 30; i++) {
//     const date = dayjs().subtract(i, "days");
//     const screenTimes: Record<string, number> = {};

//     screens.forEach((screen) => {
//       // Gerar tempo aleatório entre 0 e 120 minutos por tela
//       screenTimes[screen] = Math.floor(Math.random() * 120);
//     });

//     data.push({
//       date: date.format("YYYY-MM-DD"),
//       screens: screenTimes,
//     });
//   }

//   return data;
// }

// export default function ColabStats({ colab }: ColabStatsProps) {
//   // colab será usado quando integrarmos com dados reais
//   void colab;
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
//   const [screenTimeData] = useState<ScreenTimeData[]>(getMockScreenTimeData());

//   // Calcular tempo médio de uso diário (em minutos)
//   const averageDailyTime =
//     screenTimeData.reduce((acc, day) => {
//       const totalMinutes = Object.values(day.screens).reduce(
//         (sum, mins) => sum + mins,
//         0
//       );
//       return acc + totalMinutes;
//     }, 0) / screenTimeData.length;

//   // Calcular ações realizadas (mock - substituir por dados reais)
//   const actionsPerformed = Math.floor(Math.random() * 100) + 50;

//   // Obter dados do dia selecionado
//   const selectedDateData = screenTimeData.find(
//     (d) => d.date === selectedDate?.format("YYYY-MM-DD")
//   );

//   // Calcular totais por tela no dia selecionado
//   const screenTimesForDate = selectedDateData
//     ? Object.entries(selectedDateData.screens)
//         .map(([key, minutes]) => ({
//           key: key as MenuKeys,
//           label: MenuConfig[key as MenuKeys]?.label || key,
//           minutes,
//         }))
//         .filter((item) => item.minutes > 0)
//         .sort((a, b) => b.minutes - a.minutes)
//     : [];

//   return (
//     <Paper className="flex flex-col gap-4 border-1 border-beergam-gray-light rounded-md max-h-full overflow-hidden">
//       {/* Métricas */}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="flex flex-col gap-1">
//           <span className="text-xs text-beergam-gray">
//             TEMPO MÉDIO DE USO DIÁRIO
//           </span>
//           <span className="text-2xl font-bold text-beergam-orange">
//             {formatDuration(Math.round(averageDailyTime))}
//           </span>
//         </div>
//         <div className="flex flex-col gap-1">
//           <span className="text-xs text-beergam-gray">AÇÕES REALIZADAS</span>
//           <span className="text-2xl font-bold text-beergam-blue-primary">
//             {actionsPerformed}
//           </span>
//         </div>
//       </div>

//       {/* Calendário */}
//       <div className="flex flex-col gap-2 h-full max-h-full">
//         <div className="w-full grid grid-cols-2 gap-4 max-h-full">
//           <LocalizationProvider
//             dateAdapter={AdapterDayjs}
//             adapterLocale="pt-br"
//             localeText={
//               ptBR.components.MuiLocalizationProvider.defaultProps.localeText
//             }
//           >
//             <StaticDatePicker
//               value={selectedDate}
//               onChange={(newValue) => setSelectedDate(newValue)}
//               disableFuture
//               displayStaticWrapperAs="desktop"
//               sx={{
//                 maxHeight: "100% !important",
//                 "& .MuiPickersLayout-contentWrapper": {
//                   maxHeight: "calc(100% - 168px) !important",
//                 },
//                 "& .MuiPickersLayout-contentWrapper .MuiDateCalendar-root": {
//                   width: "100% !important",
//                   margin: "initial !important",
//                   height: "100% !important",
//                   maxHeight: "100% !important",
//                 },
//                 "& .MuiDialogActions-root": {
//                   display: "none !important",
//                 },
//                 "& .Mui-selected": {
//                   backgroundColor:
//                     "var(--color-beergam-blue-primary) !important",
//                   color: "white !important",
//                   "&:hover": {
//                     backgroundColor:
//                       "var(--color-beergam-blue-primary) !important",
//                   },
//                 },
//               }}
//             />
//           </LocalizationProvider>
//           {selectedDateData && screenTimesForDate.length > 0 && (
//             <div className="flex flex-col gap-2">
//               <span className="text-xs text-beergam-gray">
//                 TEMPO POR TELA - {selectedDate?.format("DD/MM/YYYY")}
//               </span>
//               <div
//                 style={{ maxHeight: "calc(100% - 200px)" }}
//                 className="flex flex-col gap-2 overflow-auto"
//               >
//                 {screenTimesForDate.map((item) => (
//                   <div
//                     key={item.key}
//                     className="flex items-center justify-between border border-beergam-gray-light rounded-md px-3 py-2"
//                   >
//                     <span className="text-sm font-medium">{item.label}</span>
//                     <span className="text-sm text-beergam-orange font-semibold">
//                       {formatDuration(item.minutes)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {(selectedDateData && screenTimesForDate.length === 0) ||
//             (!selectedDateData && (
//               <div className="text-sm text-beergam-gray opacity-70 text-center py-4">
//                 Nenhuma atividade registrada para este dia
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* Tempo por tela no dia selecionado */}
//     </Paper>
//   );
// }
