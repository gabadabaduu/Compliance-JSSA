import React from 'react';
import { useAjustesNames } from '../hooks/useAjustesNames';

export default function AjustesNamesList() {
    const { data, isPending, isError, error, refetch } = useAjustesNames();

    if (isPending) return <div>Cargando Ajustes...</div>;

    if (isError) return (
        <div>
            Error cargando Ajustes: {error.message}
            <button onClick={() => refetch()}>Reintentar</button>
        </div>
    );

    return (
        <ul>
            {data && data.length > 0
                ? data.map(item => <li key={item.id}>{item.nombre}</li>)
                : <li>No hay datos</li>
            }
        </ul>
    );
}