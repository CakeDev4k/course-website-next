'use client';       
import { logout } from "../api/auth";

const LogoutButton = () => {
    return (
        <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer" onClick={() => {
            // Exemplo simples de logout (remover cookie e redirecionar)
            logout().then(() => {
                window.location.href = '/';
            });
        }}>
            Sair
        </button>
    );
};

export default LogoutButton;