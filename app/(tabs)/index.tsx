import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  Activity,
  Target,
  Clock,
  TrendingUp,
  Play,
  Calendar,
  Award,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const isLargeScreen = width > 1024;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const progressValue = useSharedValue(0);

  const colors = {
    primary: '#10B981',
    secondary: '#64748B',
    accent: '#F97316',
    background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
    surface: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
    card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    cardGlass: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.4)' : 'rgba(255, 255, 255, 0.4)',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    textSecondary: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.3)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    overlay: colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    progressValue.value = withTiming(0.68, { duration: 1500 });
    return () => clearInterval(timer);
  }, []);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const quickStats = [
    { label: 'Steps', value: '8,547', target: '10,000', icon: Activity, color: colors.primary },
    { label: 'Calories', value: '420', target: '600', icon: Target, color: colors.accent },
    { label: 'Active Min', value: '45', target: '60', icon: Clock, color: colors.success },
    { label: 'Heart Rate', value: '72', target: 'BPM', icon: Heart, color: colors.error },
  ];

  const recentWorkouts = [
    { name: 'Morning Run', duration: '32 min', calories: 285, type: 'Cardio' },
    { name: 'Strength Training', duration: '45 min', calories: 320, type: 'Strength' },
    { name: 'Yoga Session', duration: '25 min', calories: 150, type: 'Flexibility' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? ['#0F172A', '#1E293B', '#334155'] 
          : ['#FFFFFF', '#F8FAFC', '#F1F5F9']
        }
        style={styles.backgroundGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === 'ios' ? 100 : 80 }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}
              </Text>
              <Text style={[styles.username, { color: colors.text }]}>Alex Northrop</Text>
            </View>
            <TouchableOpacity style={[styles.profileButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.profileInitial}>A</Text>
            </TouchableOpacity>
          </View>

          {/* Daily Progress Card */}
          <View style={[styles.progressCard, { borderColor: colors.border }]}>
            <View style={[styles.cardContent, { backgroundColor: colors.card }]}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: colors.text }]}>Today's Progress</Text>
                <Text style={[styles.progressDate, { color: colors.textSecondary }]}>
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              
              <View style={styles.mainMetric}>
                <View style={[styles.stepsCircle, { borderColor: colors.primary }]}>
                  <Text style={[styles.stepsNumber, { color: colors.primary }]}>8,547</Text>
                  <Text style={[styles.stepsLabel, { color: colors.textSecondary }]}>steps</Text>
                </View>
                
                <View style={styles.progressDetails}>
                  <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
                    <Animated.View 
                      style={[
                        styles.progressFill,
                        { backgroundColor: colors.primary },
                        animatedProgressStyle
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    68% to goal
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View 
                key={index} 
                style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                <Text style={[styles.statTarget, { color: colors.textSecondary }]}>/{stat.target}</Text>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Start</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                <Play size={24} color="white" />
                <Text style={styles.actionButtonText}>Start Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButtonSecondary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Calendar size={24} color={colors.primary} />
                <Text style={[styles.actionButtonSecondaryText, { color: colors.primary }]}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivity}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Workouts</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentWorkouts.map((workout, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.workoutItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.workoutIcon, { backgroundColor: colors.surface }]}>
                  <Activity size={20} color={colors.primary} />
                </View>
                <View style={styles.workoutDetails}>
                  <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
                  <Text style={[styles.workoutMeta, { color: colors.textSecondary }]}>
                    {workout.duration} • {workout.calories} cal • {workout.type}
                  </Text>
                </View>
                <View style={styles.workoutBadge}>
                  <Award size={16} color={colors.accent} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 40 : 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  username: {
    fontSize: isTablet ? 28 : 24,
    fontFamily: 'Inter-Bold',
  },
  profileButton: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-Bold',
  },
  progressCard: {
    marginHorizontal: isTablet ? 40 : 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardContent: {
    padding: isTablet ? 24 : 20,
    borderRadius: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-SemiBold',
  },
  progressDate: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
  },
  mainMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepsCircle: {
    width: isTablet ? 96 : 80,
    height: isTablet ? 96 : 80,
    borderRadius: isTablet ? 48 : 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stepsNumber: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-Bold',
  },
  stepsLabel: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
  },
  progressDetails: {
    flex: 1,
  },
  progressBar: {
    height: isTablet ? 10 : 8,
    borderRadius: isTablet ? 5 : 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: isTablet ? 5 : 4,
  },
  progressText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: isTablet ? 40 : 20,
    marginBottom: 24,
    gap: isTablet ? 16 : 12,
  },
  statCard: {
    width: isTablet ? (width - 112) / 2 : (width - 52) / 2,
    borderRadius: 16,
    padding: isTablet ? 20 : 16,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: isTablet ? 42 : 36,
    height: isTablet ? 42 : 36,
    borderRadius: isTablet ? 21 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: isTablet ? 24 : 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  statTarget: {
    fontSize: isTablet ? 12 : 11,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    paddingHorizontal: isTablet ? 40 : 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: isTablet ? 16 : 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 18 : 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 18 : 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonSecondaryText: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
  },
  recentActivity: {
    paddingHorizontal: isTablet ? 40 : 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  workoutIcon: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
  },
  workoutBadge: {
    padding: 8,
  },
});