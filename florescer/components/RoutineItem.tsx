// florescer/components/RoutineItem.tsx

import React from 'react';
import { View, StyleSheet, Alert, Pressable, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import { SvgXml } from 'react-native-svg';

// SVGs convertidos para uso no React Native
const LightningIcon = () => {
    const { theme } = useTheme();
    return (
        <SvgXml
            width={48}
            height={48}
            xml={`<svg width="48" viewBox="0 -960 960 960" height="48" xmlns="http://www.w3.org/2000/svg"><path fill="${theme.colors.onSurface}" d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z" /></svg>`}
        />
    );
};

const OptionsIcon = () => {
    const { theme } = useTheme();
    return (
        <SvgXml
            width={32}
            height={32}
            xml={`<svg width="32" viewBox="0 -960 960 960" height="32" xmlns="http://www.w3.org/2000/svg"><path fill="${theme.colors.onSurface}" d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z" /></svg>`}
        />
    );
};


interface RoutineItemProps {
  routine: Routine;
  onUpdate: (routine: Routine) => void;
  onDelete: (id: string) => void;
  drag?: () => void;
  isActive?: boolean;
  isExpanded: boolean;
  onExpandToggle: () => void;
  index: number;
}

export default function RoutineItem({ routine, onUpdate, onDelete, drag, isActive = false, isExpanded, onExpandToggle, index }: RoutineItemProps) {
  const router = useRouter();
  const { theme } = useTheme();

  // Animação para o efeito de "hover"
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };


  const handleSetCompleted = () => {
    const updatedRoutine = { ...routine, progress: routine.goal, isCompleted: true };
    onUpdate(updatedRoutine);
  };

  const handleEdit = () => {
    if (routine.isCompleted) return;
    router.push(`/routine/${routine.id}`);
  };

  const handleDeleteConfirmation = () => {
    Alert.alert(
      "Excluir Rotina",
      `Tem certeza que deseja excluir a rotina "${routine.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => onDelete(routine.id),
          style: "destructive",
        },
      ]
    );
  };

  const handleIncrement = () => {
    if (routine.progress < routine.goal) {
      const newProgress = routine.progress + 1;
      const isNowCompleted = newProgress === routine.goal;
      const updatedRoutine = { ...routine, progress: newProgress, isCompleted: isNowCompleted };
      onUpdate(updatedRoutine);
    }
  };

  const handleDecrement = () => {
    if (routine.progress > 0) {
      const updatedRoutine = { ...routine, progress: routine.progress - 1 };
      onUpdate(updatedRoutine);
    }
  };


  return (
    <Pressable
      onPress={onExpandToggle}
      onLongPress={!routine.isCompleted ? drag : undefined}
      disabled={isActive || routine.isCompleted}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { backgroundColor: '#fff480', transform: [{ scale: scaleValue }] }]}>
        <View style={styles.cardImage}>
          <LightningIcon />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            {/* <-- MUDANÇA AQUI: Usando o index para o número */}
            <Text style={styles.cardTitle}>{`0${index + 1}.`}</Text>
            <Text style={styles.cardText}>{routine.name}</Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.cardText}>{`${routine.progress}/${routine.goal}`}</Text>
            <OptionsIcon />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 30, // 2.5em é aproximadamente 30
    padding: 24, // 2em é aproximadamente 24
    marginVertical: 8,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    justifyContent: 'space-between',
    height: 120, // Altura fixa para manter a consistência
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: 'black',
  },
  cardText: {
    fontWeight: '600',
    color: 'black',
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
});