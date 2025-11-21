import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { authApi } from '../api/authApi';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Hardcodear dos usuarios válidos
        const allowedUsers = [
            { email: 'admin@example.com', password: '123456' },
            { email: 'user@example.com', password: 'abcdef' }
        ];

        const isAllowed = allowedUsers.some(
            (u) => u.email === email && u.password === password
        );

        if (isAllowed) {
            // Guardar token ficticio si quieres
            localStorage.setItem('access_token', 'fake-token');

            // Redirigir al dashboard
            navigate('/dashboard');
        } else {
            alert('Usuario o contraseña no permitidos');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">🏛️ Compliance Platform</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}