import { Stack, usePathname } from 'expo-router';
import { ThemeProvider } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import { View } from 'react-native';

export default function RootLayout() {
    const pathname = usePathname();

    return (
        <ThemeProvider>
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
                {/* Só mostra a Navbar se não estiver na tela de login */}
                {pathname !== '/login' && <Navbar />}
            </View>
        </ThemeProvider>
    );
}