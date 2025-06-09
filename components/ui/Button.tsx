import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useColorScheme,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const colorScheme = useColorScheme();

  const colors = {
    primary: '#10B981',
    secondary: '#64748B',
    surface: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    border: colorScheme === 'dark' ? '#475569' : '#E2E8F0',
  };

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[size],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.secondary : colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.secondary : colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text` as keyof typeof styles],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: 'white',
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: colors.text,
        };
      case 'outline':
        return {
          ...baseTextStyle,
          color: disabled ? colors.secondary : colors.primary,
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={[getTextStyles(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  small: {
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 10 : 8,
  },
  medium: {
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 14 : 12,
  },
  large: {
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 18 : 16,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: isTablet ? 14 : 12,
  },
  mediumText: {
    fontSize: isTablet ? 16 : 14,
  },
  largeText: {
    fontSize: isTablet ? 18 : 16,
  },
});
