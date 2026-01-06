import React from 'react';
import { useRatNames } from '../hooks/useRatNames';

export default function RatNamesList() {
    const { data, isPending, isError, error, refetch } = useRatNames();

    if (isPending) return <div>Cargando RAT...</div>;

    if (isError) return (
        <div>
            Error cargando RAT: {error.message}
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