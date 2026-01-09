import React from 'react';
import { useSancionNames } from '../hooks/useSancionNames';

export default function SancionNamesList() {
    const { data, isPending, isError, error, refetch } = useSancionNames();

    if (isPending) return <div>Cargando Sanciones...</div>;

    if (isError) return (
        <div>
            Error cargando Sanciones: {error.message}
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