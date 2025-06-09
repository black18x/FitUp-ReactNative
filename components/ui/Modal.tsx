import React, { useEffect } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
  Platform,
  ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'fullscreen' | 'bottom-sheet';
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'slide' | 'fade' | 'spring';
  containerStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  variant = 'default',
  size = 'medium',
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = 'spring',
  containerStyle,
}) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(variant === 'bottom-sheet' ? height : 0);

  const colors = {
    primary: '#10B981',
    background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
    surface: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
    card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    textSecondary: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.3)',
    overlay: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  };

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      
      if (variant === 'bottom-sheet') {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 90,
        });
      } else {
        scale.value = animationType === 'spring' 
          ? withSpring(1, { damping: 15, stiffness: 150 })
          : withTiming(1, { duration: 300 });
      }
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      
      if (variant === 'bottom-sheet') {
        translateY.value = withTiming(height, { duration: 300 });
      } else {
        scale.value = withTiming(0.9, { duration: 200 });
      }
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => {
    if (variant === 'bottom-sheet') {
      return {
        transform: [{ translateY: translateY.value }],
      };
    }
    
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const getModalSize = () => {
    if (variant === 'fullscreen') {
      return {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
      };
    }

    if (variant === 'bottom-sheet') {
      return {
        width: '100%',
        maxHeight: '80%',
        minHeight: '30%',
      };
    }

    switch (size) {
      case 'small':
        return {
          width: isTablet ? '40%' : '85%',
          maxWidth: isTablet ? 400 : 320,
          maxHeight: '60%',
        };
      case 'large':
        return {
          width: isTablet ? '80%' : '95%',
          maxWidth: isTablet ? 800 : 400,
          maxHeight: '90%',
        };
      default:
        return {
          width: isTablet ? '60%' : '90%',
          maxWidth: isTablet ? 600 : 350,
          maxHeight: '80%',
        };
    }
  };

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={20}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.overlay },
              backdropStyle,
            ]}
          />
        )}

        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>              <Animated.View
                style={[
                  styles.modal,
                  variant === 'bottom-sheet' && styles.bottomSheetModal,
                  variant === 'fullscreen' && styles.fullscreenModal,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                  getModalSize() as any,
                  modalStyle,
                  containerStyle,
                ]}
              >
                {variant === 'bottom-sheet' && (
                  <View style={[styles.bottomSheetHandle, { backgroundColor: colors.border }]} />
                )}

                {(title || showCloseButton) && (
                  <View style={styles.header}>
                    {title && (
                      <Text style={[styles.title, { color: colors.text }]}>
                        {title}
                      </Text>
                    )}
                    {showCloseButton && (
                      <TouchableOpacity
                        onPress={onClose}
                        style={[styles.closeButton, { backgroundColor: colors.surface }]}
                      >
                        <X size={isTablet ? 24 : 20} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <View style={styles.content}>
                  {children}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isTablet ? 40 : 20,
  },
  modal: {
    borderRadius: 20,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 30,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  bottomSheetModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    margin: 0,
    maxWidth: '100%',
  },
  fullscreenModal: {
    borderRadius: 0,
    margin: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 24 : 20,
    paddingTop: isTablet ? 24 : 20,
    paddingBottom: isTablet ? 16 : 12,
  },
  title: {
    fontSize: isTablet ? 24 : 20,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  closeButton: {
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    borderRadius: isTablet ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 24 : 20,
    paddingBottom: isTablet ? 24 : 20,
  },
});
