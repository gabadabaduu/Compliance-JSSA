import React from 'react';
import { useNormogramaNames } from '../hooks/useNormogramaNames';

export default function NormogramaNamesList() {
    const { data, isPending, isError, error, refetch } = useNormogramaNames();

    if (isPending) return <div>Cargando Normograma...</div>;

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