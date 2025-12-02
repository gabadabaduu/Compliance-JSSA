import React from 'react';
import { useMatrizRiesgoNames } from '../hooks/useMatrizRiesgoNames';

export default function MatrizRiesgoNamesList() {
    const { data, isPending, isError, error, refetch } = useMatrizRiesgoNames();

    if (isPending) return <div>Cargando Matriz Riesgo...</div>;

    if (isError) return (
        <div>
            Error cargando Matriz Riesgo: {error.message}
            <button onClick={() => refetch()}>Reintentar</button>
        </div>
    );

    return (
        <ul>
            {data && data. length > 0
                ? data.map(item => <li key={item.id}>{item.nombre}</li>)
                : <li>No hay datos</li>
            }
        </ul>
    );
}