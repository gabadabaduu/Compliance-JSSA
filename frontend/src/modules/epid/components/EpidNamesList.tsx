import React from 'react';
import { useEpidNames } from '../hooks/useEpidNames';

export default function EpidNamesList() {
    const { data, isPending, isError, error, refetch } = useEpidNames();

    if (isPending) return <div>Cargando EPID...</div>;

    if (isError) return (
        <div>
            Error cargando EPID: {error.message}
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