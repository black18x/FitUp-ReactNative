import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Share,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Trophy,
  Share2,
  Calendar,
  Clock,
  Flame,
  Target,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  Home,
  BarChart3,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInUp, 
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withSpring
} from 'react-native-reanimated';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { 
  workouts, 
  formatDuration,
  currentUser 
} from '../../../data/demoData';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

export default function WorkoutSummaryScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [showCelebration, setShowCelebration] = useState(true);
  
  const workout = workouts.find(w => w.id === id);
  
  const colors = {
    primary: '#10B981',
    secondary: '#64748B',
    accent: '#F97316',
    background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
    surface: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.9)',
    card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    textSecondary: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
    border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.4)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  // Generate workout session data
  const sessionData = {
    duration: workout?.duration || 30,
    caloriesBurned: workout?.calories || 250,
    exercisesCompleted: workout?.exercises.length || 5,
    totalSets: workout?.exercises.reduce((total, ex) => total + ex.sets, 0) || 15,
    personalRecords: Math.floor(Math.random() * 3) + 1, // Random PRs
    averageHeartRate: Math.floor(Math.random() * 40) + 120,
    peakHeartRate: Math.floor(Math.random() * 20) + 160,
    restTime: Math.floor(Math.random() * 10) + 5, // Minutes
  };

  // Achievements earned this session
  const newAchievements = [
    {
      id: '1',
      title: 'Consistency King',
      description: 'Complete 3 workouts this week',
      icon: '👑',
      isNew: true,
    },
    {
      id: '2', 
      title: 'Calorie Crusher',
      description: 'Burn 250+ calories in one session',
      icon: '🔥',
      isNew: false,
    },
  ];

  // Animation values
  const celebrationScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const achievementsOpacity = useSharedValue(0);

  useEffect(() => {
    // Vibration for completion feedback
    Vibration.vibrate([100, 50, 100]);
    
    // Start celebration animation
    celebrationScale.value = withSpring(1, {
      duration: 800,
      dampingRatio: 0.6,
    });
    
    // Animate stats in sequence
    setTimeout(() => {
      statsOpacity.value = withTiming(1, { duration: 600 });
    }, 400);
    
    setTimeout(() => {
      achievementsOpacity.value = withTiming(1, { duration: 600 });
    }, 800);
    
    // Hide celebration after delay
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  }, []);

  const celebrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const achievementsStyle = useAnimatedStyle(() => ({
    opacity: achievementsOpacity.value,
  }));

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Just completed "${workout?.name}" workout! 🔥\n\n` +
                `📊 ${sessionData.duration} minutes\n` +
                `🔥 ${sessionData.caloriesBurned} calories burned\n` +
                `💪 ${sessionData.exercisesCompleted} exercises completed\n\n` +
                `Join me on FitnessApp! #FitnessJourney`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color = colors.primary }: any) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  const AchievementCard = ({ achievement }: any) => (
    <View style={[styles.achievementCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.achievementIcon, { backgroundColor: colors.accent + '15' }]}>
        <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
        {achievement.isNew && (
          <View style={[styles.newBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, { color: colors.text }]}>{achievement.title}</Text>
        <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
          {achievement.description}
        </Text>
      </View>
    </View>
  );

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Workout not found</Text>
          <Button
            title="Go Home"
            onPress={() => router.push('/(tabs)')}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Celebration Header */}
        {showCelebration && (
          <Animated.View style={[styles.celebrationContainer, celebrationStyle]}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.celebrationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Trophy size={48} color="white" />
              <Text style={styles.celebrationTitle}>Workout Complete!</Text>
              <Text style={styles.celebrationSubtitle}>Amazing job, {currentUser.name}!</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Workout Summary */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <Card style={{ ...styles.summaryCard, backgroundColor: colors.card }}>
            <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
            <Text style={[styles.workoutDescription, { color: colors.textSecondary }]}>
              {workout.description}
            </Text>
            
            <View style={styles.quickStats}>
              <View style={styles.quickStat}>
                <Clock size={16} color={colors.primary} />
                <Text style={[styles.quickStatText, { color: colors.text }]}>
                  {sessionData.duration} min
                </Text>
              </View>
              <View style={styles.quickStat}>
                <Flame size={16} color={colors.accent} />
                <Text style={[styles.quickStatText, { color: colors.text }]}>
                  {sessionData.caloriesBurned} cal
                </Text>
              </View>
              <View style={styles.quickStat}>
                <Target size={16} color={colors.success} />
                <Text style={[styles.quickStatText, { color: colors.text }]}>
                  {sessionData.exercisesCompleted} exercises
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Detailed Stats */}
        <Animated.View style={[styles.section, statsStyle]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Session Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              icon={Clock} 
              label="Duration" 
              value={`${sessionData.duration}m`}
              color={colors.primary}
            />
            <StatCard 
              icon={Flame} 
              label="Calories" 
              value={sessionData.caloriesBurned}
              color={colors.accent}
            />
            <StatCard 
              icon={CheckCircle} 
              label="Sets" 
              value={sessionData.totalSets}
              color={colors.success}
            />
            <StatCard 
              icon={TrendingUp} 
              label="Avg HR" 
              value={`${sessionData.averageHeartRate} bpm`}
              color={colors.error}
            />
          </View>
        </Animated.View>

        {/* Performance Highlights */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance</Text>
          <Card style={{ ...styles.performanceCard, backgroundColor: colors.card }}>
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <View style={[styles.performanceIcon, { backgroundColor: colors.error + '15' }]}>
                  <TrendingUp size={20} color={colors.error} />
                </View>
                <View>
                  <Text style={[styles.performanceValue, { color: colors.text }]}>
                    {sessionData.peakHeartRate} bpm
                  </Text>
                  <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                    Peak Heart Rate
                  </Text>
                </View>
              </View>
              
              <View style={styles.performanceItem}>
                <View style={[styles.performanceIcon, { backgroundColor: colors.warning + '15' }]}>
                  <Star size={20} color={colors.warning} />
                </View>
                <View>
                  <Text style={[styles.performanceValue, { color: colors.text }]}>
                    {sessionData.personalRecords}
                  </Text>
                  <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                    Personal Records
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Achievements */}
        <Animated.View style={[styles.section, achievementsStyle]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements Unlocked</Text>
          {newAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </Animated.View>        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.actionSection}>
          <Button
            title="Share Achievement"
            onPress={handleShare}
            icon={<Share2 size={20} color="white" />}
            style={{ ...styles.shareButton, backgroundColor: colors.primary }}
          />
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/progress')}
            >
              <BarChart3 size={20} color={colors.text} />
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>View Progress</Text>
              <ArrowRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)')}
            >
              <Home size={20} color={colors.text} />
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Back to Home</Text>
              <ArrowRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  celebrationContainer: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  celebrationGradient: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  summaryCard: {
    padding: 24,
    borderRadius: 16,
  },
  workoutName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStatText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: isTablet ? 160 : (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  performanceCard: {
    padding: 20,
    borderRadius: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  performanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  performanceValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  performanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  achievementEmoji: {
    fontSize: 24,
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 8,
    fontFamily: 'Inter-Bold',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  actionSection: {
    marginTop: 8,
  },
  shareButton: {
    marginBottom: 16,
  },
  secondaryActions: {
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
