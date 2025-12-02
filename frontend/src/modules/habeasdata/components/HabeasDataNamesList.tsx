import React from 'react';
import { useHabeasDataNames } from '../hooks/useHabeasDataNames';

export default function HabeasDataNamesList() {
    const { data, isPending, isError, error, refetch } = useHabeasDataNames();

    if (isPending) return <div>Cargando Habeas Data...</div>;

    if (isError) return (
        <div>
            Error cargando Habeas Data: {error.message}
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