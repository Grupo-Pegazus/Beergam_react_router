import { z } from "zod";
export enum WeekDay {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export interface DayTimeAccess {
  start_date: Date | null;
  end_date: Date | null;
  access: boolean;
}

export interface IAllowedTimes {
  monday: DayTimeAccess;
  tuesday: DayTimeAccess;
  wednesday: DayTimeAccess;
  thursday: DayTimeAccess;
  friday: DayTimeAccess;
  saturday: DayTimeAccess;
  sunday: DayTimeAccess;
}

// Modificar o DayTimeAccessSchema para aceitar strings e converter para Date
const DayTimeAccessSchema = z
  .object({
    start_date: z.coerce.date().nullable(),
    end_date: z.coerce.date().nullable(),
    access: z.boolean(),
  })
  .refine(
    (data) => {
      // start_date nunca pode ser maior ou igual que end_date
      if (data.start_date !== null && data.end_date !== null) {
        const startTime =
          data.start_date.getHours() * 60 + data.start_date.getMinutes();
        const endTime =
          data.end_date.getHours() * 60 + data.end_date.getMinutes();
        return startTime < endTime;
      }
      return true;
    },
    {
      message: "'start_date' deve ser menor que 'end_date'",
      path: ["start_date"],
    }
  )
  .refine(
    (data) => {
      // Validação dupla para end_date
      if (data.start_date !== null && data.end_date !== null) {
        const startTime =
          data.start_date.getHours() * 60 + data.start_date.getMinutes();
        const endTime =
          data.end_date.getHours() * 60 + data.end_date.getMinutes();
        return endTime > startTime;
      }
      return true;
    },
    {
      message: "'end_date' deve ser maior que 'start_date'",
      path: ["end_date"],
    }
  );

export const AllowedTimesSchema = z.object({
  monday: DayTimeAccessSchema,
  tuesday: DayTimeAccessSchema,
  wednesday: DayTimeAccessSchema,
  thursday: DayTimeAccessSchema,
  friday: DayTimeAccessSchema,
  saturday: DayTimeAccessSchema,
  sunday: DayTimeAccessSchema,
}) satisfies z.ZodType<IAllowedTimes>;

export function getEmptyAllowedTimes(): IAllowedTimes {
  return {
    monday: {
      start_date: null,
      end_date: null,
      access: false,
    },
    tuesday: {
      start_date: null,
      end_date: null,
      access: false,
    },
    wednesday: {
      start_date: null,
      end_date: null,
      access: false,
    },
    thursday: {
      start_date: null,
      end_date: null,
      access: false,
    },
    friday: {
      start_date: null,
      end_date: null,
      access: false,
    },
    saturday: {
      start_date: null,
      end_date: null,
      access: false,
    },
    sunday: {
      start_date: null,
      end_date: null,
      access: false,
    },
  };
}
export const WeekDayToPortuguese = {
  [WeekDay.MONDAY]: "Segunda",
  [WeekDay.TUESDAY]: "Terça",
  [WeekDay.WEDNESDAY]: "Quarta",
  [WeekDay.THURSDAY]: "Quinta",
  [WeekDay.FRIDAY]: "Sexta",
  [WeekDay.SATURDAY]: "Sábado",
  [WeekDay.SUNDAY]: "Domingo",
};
