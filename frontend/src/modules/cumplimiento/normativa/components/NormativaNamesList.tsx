import React from 'react';
import { useNormativaNames } from '../hooks/useNormativaNames';

export default function NormativaNamesList() {
    const { data, isPending, isError, error, refetch } = useNormativaNames();

    if (isPending) return <div>Cargando Normativa...</div>;

    if (isError) return (
        <div>
            Error cargando Normograma: {error.message}
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