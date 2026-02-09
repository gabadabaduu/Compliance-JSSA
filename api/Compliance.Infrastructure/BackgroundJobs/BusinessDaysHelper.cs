using System;
using System.Collections.Generic;

namespace Compliance.Infrastructure.Helpers
{
    public static class BusinessDaysHelper
    {
        /// <summary>
        /// Agrega días hábiles a una fecha (excluye sábados y domingos)
        /// ✅ Retorna DateTime en UTC para compatibilidad con PostgreSQL
        /// </summary>
        public static DateTime AddBusinessDays(DateTime startDate, int businessDays)
        {
            if (businessDays == 0)
                return DateTime.SpecifyKind(startDate, DateTimeKind.Utc);

            // ✅ Asegurar que la fecha inicial sea UTC
            var currentDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            var daysAdded = 0;

            while (daysAdded < businessDays)
            {
                currentDate = currentDate.AddDays(1);

                // Saltar fines de semana
                if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                    currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    daysAdded++;
                }
            }

            return currentDate;
        }

        /// <summary>
        /// Lista de días festivos en Colombia (puedes agregar más o hacerlo dinámico)
        /// </summary>
        private static readonly HashSet<DateTime> Holidays = new()
        {
            // 2026 - Festivos en Colombia (ejemplo)
            new DateTime(2026, 1, 1),   // Año Nuevo
            new DateTime(2026, 1, 12),  // Reyes Magos
            new DateTime(2026, 3, 23),  // San José
            new DateTime(2026, 4, 9),   // Jueves Santo
            new DateTime(2026, 4, 10),  // Viernes Santo
            new DateTime(2026, 5, 1),   // Día del Trabajo
            new DateTime(2026, 5, 25),  // Ascensión
            new DateTime(2026, 6, 15),  // Corpus Christi
            new DateTime(2026, 6, 22),  // Sagrado Corazón
            new DateTime(2026, 6, 29),  // San Pedro y San Pablo
            new DateTime(2026, 7, 20),  // Independencia
            new DateTime(2026, 8, 7),   // Batalla de Boyacá
            new DateTime(2026, 8, 17),  // Asunción
            new DateTime(2026, 10, 12), // Día de la Raza
            new DateTime(2026, 11, 2),  // Todos los Santos
            new DateTime(2026, 11, 16), // Independencia de Cartagena
            new DateTime(2026, 12, 8),  // Inmaculada Concepción
            new DateTime(2026, 12, 25), // Navidad
        };

        /// <summary>
        /// Agrega días hábiles considerando festivos (opcional)
        /// ✅ Retorna DateTime en UTC para compatibilidad con PostgreSQL
        /// </summary>
        public static DateTime AddBusinessDaysWithHolidays(DateTime startDate, int businessDays)
        {
            if (businessDays == 0)
                return DateTime.SpecifyKind(startDate, DateTimeKind.Utc);

            // ✅ Asegurar que la fecha inicial sea UTC
            var currentDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            var daysAdded = 0;

            while (daysAdded < businessDays)
            {
                currentDate = currentDate.AddDays(1);

                // Saltar fines de semana y festivos
                if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                    currentDate.DayOfWeek != DayOfWeek.Sunday &&
                    !Holidays.Contains(currentDate.Date))
                {
                    daysAdded++;
                }
            }

            return currentDate;
        }
    }
}