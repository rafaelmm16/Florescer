import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Switch, Button, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';
import Header from '../components/Header';

export default function SettingsScreen() {
    const router = useRouter();
    const { toggleTheme, isDark, theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Ajustes" showBack={true} onBack={() => router.back()} />
            <View style={styles.content}>
                <View style={styles.optionRow}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                        Tema Escuro
                    </Text>
                    <Switch value={isDark} onValueChange={toggleTheme} />
                </View>

                <Button
                    icon="account-circle-outline"
                    mode="outlined"
                    onPress={() => router.push('/profile')}
                    style={styles.profileButton}
                >
                    Meu Perfil
                </Button>

                <Divider style={{ marginVertical: 20 }} />

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
    profileButton: {
      marginTop: 20,
    },
});