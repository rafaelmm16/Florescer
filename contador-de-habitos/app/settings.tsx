import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Text, Switch, Button, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';
import Header from '../components/Header';
import { useAuth } from '../components/AuthContext'; // Importar useAuth

export default function SettingsScreen() {
    const router = useRouter();
    const { toggleTheme, isDark, theme } = useTheme();
    const { logout } = useAuth(); // Usar a função de logout do contexto

    const handleLogout = () => {
        Alert.alert(
            "Confirmar Saída",
            "Você tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    onPress: async () => {
                        await logout(); // Chamar a função de logout
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Ajustes" showBack onBack={() => router.back()} />
            <View style={styles.content}>
                <View style={styles.optionRow}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                        Tema Escuro
                    </Text>
                    <Switch value={isDark} onValueChange={toggleTheme} />
                </View>

                <Divider style={{ marginVertical: 20 }} />

                <Button
                    icon="logout"
                    mode="contained"
                    onPress={handleLogout}
                    buttonColor={theme.colors.error}
                    textColor={theme.colors.onError}
                    style={styles.logoutButton}
                >
                    Sair
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    logoutButton: {
      marginTop: 30,
    }
});