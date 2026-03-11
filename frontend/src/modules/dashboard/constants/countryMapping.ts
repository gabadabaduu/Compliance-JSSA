/**
 * Mapeo de nombres de países (español) a nombres en inglés.
 * world-atlas@2 usa geo.properties.name con nombres en inglés.
 */
export const COUNTRY_ES_TO_EN: Record<string, string> = {
    // América
    'Colombia': 'Colombia',
    'México': 'Mexico',
    'Argentina': 'Argentina',
    'Chile': 'Chile',
    'Perú': 'Peru',
    'Ecuador': 'Ecuador',
    'Brasil': 'Brazil',
    'Estados Unidos': 'United States of America',

    // Europa
    'España': 'Spain',
};

/**
 * Convierte un array de nombres de países (español) a nombres en inglés (Set).
 * Ignora los que no encuentra en el mapeo.
 */
export function countryNamesToEnglish(names: string[]): Set<string> {
    const englishNames = new Set<string>();
    for (const name of names) {
        const en = COUNTRY_ES_TO_EN[name];
        if (en) {
            englishNames.add(en);
        }
    }
    return englishNames;
}