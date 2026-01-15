using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Compliance.Core.Modules.Cumplimiento.Sancion.Dtos
{
    /// <summary>
    /// Etapa del proceso sancionatorio
    /// IMPORTANTE: Los valores deben coincidir EXACTAMENTE con los enum labels de PostgreSQL
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SanctionStage
    {
        [EnumMember(Value = "Decisión Inicial")]
        DecisionInicial,

        [EnumMember(Value = "Recurso de Reposición")]
        RecursoReposicion,

        [EnumMember(Value = "Recurso de Apelación")]
        RecursoApelacion
    }

    /// <summary>
    /// Estado del proceso sancionatorio
    /// IMPORTANTE: Los valores deben coincidir EXACTAMENTE con los enum labels de PostgreSQL
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SanctionStatus
    {
        [EnumMember(Value = "En trámite")]
        EnTramite,

        [EnumMember(Value = "En firme")]
        EnFirme
    }
}