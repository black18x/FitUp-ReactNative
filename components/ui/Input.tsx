import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  useColorScheme,
  Dimensions,
  Platform,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconPress,
      variant = 'default',
      size = 'medium',
      containerStyle,
      disabled = false,
      style,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();

    const colors = {
      primary: '#10B981',
      secondary: '#64748B',
      background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
      surface: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
      card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.8)',
      text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
      textSecondary: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
      border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.3)',
      borderFocus: colorScheme === 'dark' ? '#10B981' : '#10B981',
      placeholder: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)',
      error: '#EF4444',
      disabled: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)',
    };    const getInputStyles = () => {
      const baseStyles: any[] = [styles.input];

      // Size styles
      switch (size) {
        case 'small':
          baseStyles.push(styles.inputSmall);
          break;
        case 'large':
          baseStyles.push(styles.inputLarge);
          break;
        default:
          baseStyles.push(styles.inputMedium);
      }

      // Variant styles
      switch (variant) {
        case 'filled':
          baseStyles.push({
            backgroundColor: colors.surface,
            borderColor: 'transparent',
          });
          break;
        case 'outline':
          baseStyles.push({
            backgroundColor: 'transparent',
            borderColor: colors.border,
            borderWidth: 1.5,
          });
          break;
        default:
          baseStyles.push({
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 0.5,
          });
      }

      // State styles
      if (error) {
        baseStyles.push({
          borderColor: colors.error,
          borderWidth: 1,
        });
      }

      if (disabled) {
        baseStyles.push({
          backgroundColor: colors.disabled,
          opacity: 0.7,
        });
      }

      // Icon padding
      if (LeftIcon) {
        baseStyles.push(styles.inputWithLeftIcon);
      }
      if (RightIcon) {
        baseStyles.push(styles.inputWithRightIcon);
      }

      return baseStyles;
    };

    const getIconSize = () => {
      switch (size) {
        case 'small':
          return isTablet ? 18 : 16;
        case 'large':
          return isTablet ? 24 : 22;
        default:
          return isTablet ? 22 : 20;
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
          </Text>
        )}
        
        <View style={styles.inputContainer}>
          {LeftIcon && (
            <View style={[styles.leftIcon, { left: size === 'small' ? 12 : size === 'large' ? 18 : 16 }]}>
              <LeftIcon
                size={getIconSize()}
                color={disabled ? colors.disabled : colors.textSecondary}
              />
            </View>
          )}

          <TextInput
            ref={ref}
            style={[
              ...getInputStyles(),
              {
                color: colors.text,
                fontSize: size === 'small' ? (isTablet ? 14 : 12) : size === 'large' ? (isTablet ? 18 : 16) : (isTablet ? 16 : 14),
              },
              style,
            ]}
            placeholderTextColor={colors.placeholder}
            editable={!disabled}
            {...props}
          />

          {RightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={[styles.rightIcon, { right: size === 'small' ? 12 : size === 'large' ? 18 : 16 }]}
              disabled={disabled}
            >
              <RightIcon
                size={getIconSize()}
                color={disabled ? colors.disabled : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    borderRadius: 12,
    fontFamily: 'Inter-Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputSmall: {
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: 10,
  },
  inputMedium: {
    paddingHorizontal: isTablet ? 18 : 16,
    paddingVertical: isTablet ? 16 : 14,
    borderRadius: 12,
  },
  inputLarge: {
    paddingHorizontal: isTablet ? 22 : 18,
    paddingVertical: isTablet ? 20 : 18,
    borderRadius: 14,
  },
  inputWithLeftIcon: {
    paddingLeft: isTablet ? 52 : 44,
  },
  inputWithRightIcon: {
    paddingRight: isTablet ? 52 : 44,
  },
  leftIcon: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  errorText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    marginLeft: 4,
  },
});

Input.displayName = 'Input';
