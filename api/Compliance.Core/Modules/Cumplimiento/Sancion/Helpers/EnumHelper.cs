using System;
using System.Linq;
using System.Runtime.Serialization;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.Sancion.Helpers
{
    public static class EnumHelper
    {
        /// <summary>
        /// Parsea un string con el valor del [EnumMember] a SanctionStage
        /// Ejemplo: "Decisión Inicial" -> SanctionStage.DecisionInicial
        /// </summary>
        public static SanctionStage ParseSanctionStage(string value)
        {
            var type = typeof(SanctionStage);
            foreach (var field in type.GetFields())
            {
                if (Attribute.GetCustomAttribute(field, typeof(EnumMemberAttribute)) is EnumMemberAttribute attribute)
                {
                    if (attribute.Value == value)
                        return (SanctionStage)field.GetValue(null)!;
                }
            }

            // Si no encuentra por [EnumMember], intentar por nombre
            if (Enum.TryParse<SanctionStage>(value.Replace(" ", ""), true, out var result))
            {
                return result;
            }

            throw new ArgumentException($"'{value}' no es un SanctionStage válido.  Valores permitidos: 'Decisión Inicial', 'Recurso de Reposición', 'Recurso de Apelación'");
        }

        /// <summary>
        /// Parsea un string con el valor del [EnumMember] a SanctionStatus
        /// Ejemplo: "En trámite" -> SanctionStatus.EnTramite
        /// </summary>
        public static SanctionStatus ParseSanctionStatus(string value)
        {
            var type = typeof(SanctionStatus);
            foreach (var field in type.GetFields())
            {
                if (Attribute.GetCustomAttribute(field, typeof(EnumMemberAttribute)) is EnumMemberAttribute attribute)
                {
                    if (attribute.Value == value)
                        return (SanctionStatus)field.GetValue(null)!;
                }
            }

            // Si no encuentra por [EnumMember], intentar por nombre
            if (Enum.TryParse<SanctionStatus>(value.Replace(" ", ""), true, out var result))
            {
                return result;
            }

            throw new ArgumentException($"'{value}' no es un SanctionStatus válido. Valores permitidos: 'En trámite', 'En firme'");
        }

        /// <summary>
        /// Obtiene el valor del [EnumMember] de un enum
        /// Ejemplo: SanctionStage.DecisionInicial -> "Decisión Inicial"
        /// </summary>
        public static string GetEnumMemberValue<T>(T enumValue) where T : Enum
        {
            var type = typeof(T);
            var memberInfo = type.GetMember(enumValue.ToString()).FirstOrDefault();

            if (memberInfo != null)
            {
                if (Attribute.GetCustomAttribute(memberInfo, typeof(EnumMemberAttribute)) is EnumMemberAttribute attribute)
                {
                    return attribute.Value ?? enumValue.ToString();
                }
            }

            return enumValue.ToString();
        }
    }
}