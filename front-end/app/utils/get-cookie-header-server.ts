import headers from 'next/headers';

const getCookieHeader = async (): Promise<string | null> => {
    try {
        const cookieStore = await headers.cookies(); // Lê headers do request no server
        const token = cookieStore.get('token')?.value; // Pega o valor do cookie 'token'

        if (!token) {
            console.error('Token não encontrado no cookie');
            return null;
        }

        return token;
    } catch (error) {
        console.error('Error getting cookie header:', error);
        return null;
    }
};

export default getCookieHeader;