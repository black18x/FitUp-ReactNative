import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  ViewStyle,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'small' | 'medium' | 'large';
}

export default function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium',
}: CardProps) {
  const colorScheme = useColorScheme();

  const colors = {
    card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    cardGlass: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.4)' : 'rgba(255, 255, 255, 0.4)',
    border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.3)',
  };

  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.card,
      ...styles[padding],
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: colors.cardGlass,
          borderWidth: 0.5,
          borderColor: colors.border,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.card,
          borderWidth: 0.5,
          borderColor: colors.border,
        };
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[getCardStyles(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  small: {
    padding: isTablet ? 16 : 12,
  },
  medium: {
    padding: isTablet ? 20 : 16,
  },
  large: {
    padding: isTablet ? 24 : 20,
  },
});
