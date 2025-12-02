import React from 'react';
import { useUsuarioNames } from '../hooks/useUsuarioNames';

export default function UsuarioNamesList() {
    const { data, isPending, isError, error, refetch } = useUsuarioNames();

    if (isPending) return <div>Cargando Usuario...</div>;

    if (isError) return (
        <div>
            Error cargando Usuario: {error.message}
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