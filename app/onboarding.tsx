import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Target, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Dumbbell,
  Heart,
  Activity,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const [currentStep, setCurrentStep] = useState(0);
  const slideX = useSharedValue(0);

  const colors = {
    primary: '#10B981',
    secondary: '#64748B',
    accent: '#F97316',
    background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
    surface: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC',
    card: colorScheme === 'dark' ? '#334155' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    textSecondary: colorScheme === 'dark' ? '#94A3B8' : '#64748B',
    border: colorScheme === 'dark' ? '#475569' : '#E2E8F0',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const onboardingData = [
    {
      id: 1,
      title: 'Track Your Progress',
      description: 'Monitor your fitness journey with detailed analytics and personalized insights to reach your goals faster.',
      icon: TrendingUp,
      color: colors.primary,
      image: 'https://images.pexels.com/photos/669584/pexels-photo-669584.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Custom Workouts',
      description: 'Get personalized workout plans tailored to your fitness level and preferences with expert guidance.',
      icon: Dumbbell,
      color: colors.accent,
      image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      title: 'Join the Community',
      description: 'Connect with like-minded fitness enthusiasts, share achievements, and stay motivated together.',
      icon: Users,
      color: colors.success,
      image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const nextStep = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
      slideX.value = withTiming((currentStep + 1) * -width);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const skipOnboarding = () => {
    router.replace('/(auth)/login');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={skipOnboarding}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.slider, animatedStyle]}>
          {onboardingData.map((item, index) => (
            <View key={item.id} style={[styles.slide, { width }]}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={[styles.iconOverlay, { backgroundColor: item.color }]}>
                  <item.icon size={32} color="white" />
                </View>
              </View>
              
              <View style={styles.textContent}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottom}>
        {/* Progress Indicators */}
        <View style={styles.indicators}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === currentStep ? colors.primary : colors.border,
                  width: index === currentStep ? 24 : 8,
                }
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={nextStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  slider: {
    flexDirection: 'row',
    height: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  bottom: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  navigation: {
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});