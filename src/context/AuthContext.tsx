import { createContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '../supabase/client.ts';

interface AuthContext {
    user: null | {
        id: string;
        email: string;
        avatar: string;
        name: string;
    };
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    loginWithGoogle: async () => { },
    loginWithFacebook: async () => { },
    logout: async () => { },
});

interface IAppProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<IAppProviderProps> = ({ children }: IAppProviderProps) => {
    const [user, setUser] = useState<null | { id: string; email: string, avatar: string, name: string }>(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            if (session)
                setUser({
                    id: session.user.user_metadata.id,
                    email: session.user.user_metadata.email,
                    avatar: session.user.user_metadata.avatar_url,
                    name: session.user.user_metadata.name,
                })
        });

        return () => {
            authListener.subscription.unsubscribe();
        }
    }, []);


    const loginWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google'
            });
            if (error)
                throw new Error("A ocurrido un error durante la autenticación");
        } catch (error) {
            console.error(error);
        }
    }

    const loginWithFacebook = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook'
            });
            if (error)
                throw new Error("A ocurrido un error durante la autenticación");
        } catch (error) {
            console.error(error);
        }
    }

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user, loginWithGoogle, loginWithFacebook, logout
        }}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;