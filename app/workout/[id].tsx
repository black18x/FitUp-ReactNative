import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Play,
  Bookmark,
  Share,
  Clock,
  Flame,
  Target,
  Dumbbell,
  Users,
  Star,
  CheckCircle,
  Circle,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  workouts, 
  exercises,
  formatDuration,
  getDifficultyColor,
  getCategoryIcon 
} from '../../data/demoData';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

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
  };

  // Find the workout by ID
  const workout = workouts.find(w => w.id === id);

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Workout not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleStartWorkout = () => {
    Alert.alert(
      'Start Workout',
      `Ready to start "${workout.name}"? This workout will take approximately ${formatDuration(workout.duration)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            // Navigate to workout session screen
            router.push(`/workout/session/${workout.id}`);
          }
        }
      ]
    );
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to persistent storage
  };

  const handleShare = () => {
    Alert.alert(
      'Share Workout',
      `Share "${workout.name}" with friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Sharing workout...') }
      ]
    );
  };

  const toggleExerciseCompletion = (exerciseId: string) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const completionPercentage = Math.round((completedExercises.length / workout.exercises.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? ['#0F172A', '#1E293B', '#334155'] 
          : ['#FFFFFF', '#F8FAFC', '#F1F5F9']
        }
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={handleBookmark}
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
            >
              <Bookmark 
                size={20} 
                color={isBookmarked ? colors.primary : colors.textSecondary}
                fill={isBookmarked ? colors.primary : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleShare}
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
            >
              <Share size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === 'ios' ? 100 : 80 }
          ]}
        >
          {/* Workout Hero */}
          <View style={styles.heroSection}>
            <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={styles.categoryEmoji}>{getCategoryIcon(workout.category)}</Text>
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {workout.category}
              </Text>
            </View>

            <Text style={[styles.workoutTitle, { color: colors.text }]}>
              {workout.name}
            </Text>
            <Text style={[styles.workoutDescription, { color: colors.textSecondary }]}>
              {workout.description}
            </Text>

            {/* Workout Stats */}
            <View style={styles.statsGrid}>
              <Card variant="glass" style={styles.statCard}>
                <Clock size={24} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatDuration(workout.duration)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
              </Card>

              <Card variant="glass" style={styles.statCard}>
                <Flame size={24} color={colors.accent} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {workout.calories}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
              </Card>

              <Card variant="glass" style={styles.statCard}>
                <Target size={24} color={colors.success} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {workout.exercises.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</Text>
              </Card>

              <Card variant="glass" style={styles.statCard}>
                <Dumbbell size={24} color={getDifficultyColor(workout.difficulty)} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {workout.difficulty}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Level</Text>
              </Card>
            </View>

            {/* Rating and Completions */}
            <View style={styles.ratingSection}>
              <View style={styles.ratingContainer}>
                <Star size={20} color={colors.warning} fill={colors.warning} />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {workout.rating} ({workout.completions.toLocaleString()} completions)
                </Text>
              </View>
              {completedExercises.length > 0 && (
                <Text style={[styles.progressText, { color: colors.primary }]}>
                  {completionPercentage}% Complete
                </Text>
              )}
            </View>
          </View>

          {/* Equipment */}
          {workout.equipment && workout.equipment.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipment Needed</Text>
              <View style={styles.equipmentList}>
                {workout.equipment.map((item, index) => (
                  <View key={index} style={[styles.equipmentItem, { backgroundColor: colors.surface }]}>
                    <Dumbbell size={16} color={colors.primary} />
                    <Text style={[styles.equipmentText, { color: colors.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Exercises */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
            {workout.exercises.map((exercise, index) => (
              <Card key={exercise.id} variant="default" style={styles.exerciseCard}>
                <TouchableOpacity 
                  style={styles.exerciseHeader}
                  onPress={() => toggleExerciseCompletion(exercise.id)}
                >
                  <View style={styles.exerciseNumber}>
                    {completedExercises.includes(exercise.id) ? (
                      <CheckCircle size={24} color={colors.success} />
                    ) : (
                      <Circle size={24} color={colors.textSecondary} />
                    )}
                    <Text style={[styles.exerciseIndexText, { color: colors.textSecondary }]}>
                      {index + 1}
                    </Text>
                  </View>

                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>
                      {exercise.name}
                    </Text>
                    <Text style={[styles.exerciseDescription, { color: colors.textSecondary }]}>
                      {exercise.description}
                    </Text>
                    
                    <View style={styles.exerciseStats}>
                      <Text style={[styles.exerciseStat, { color: colors.textSecondary }]}>
                        {exercise.sets} sets
                      </Text>
                      <Text style={[styles.exerciseStat, { color: colors.textSecondary }]}>
                        {exercise.reps} reps
                      </Text>
                      <Text style={[styles.exerciseStat, { color: colors.textSecondary }]}>
                        {exercise.restTime}s rest
                      </Text>
                    </View>

                    {exercise.muscleGroups && (
                      <View style={styles.muscleGroups}>
                        {exercise.muscleGroups.map((group, idx) => (
                          <View key={idx} style={[styles.muscleGroupTag, { backgroundColor: `${colors.primary}15` }]}>
                            <Text style={[styles.muscleGroupText, { color: colors.primary }]}>
                              {group}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  <TouchableOpacity 
                    style={[styles.exerciseDetailButton, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/exercise/${exercise.id}`)}
                  >
                    <Info size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Card>
            ))}
          </View>

          {/* Tags */}
          {workout.tags && workout.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
              <View style={styles.tagsList}>
                {workout.tags.map((tag, index) => (
                  <View key={index} style={[styles.tag, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Start Workout Button */}
          <View style={styles.startSection}>            <Button
              title="Start Workout"
              onPress={handleStartWorkout}
              size="large"
              icon={<Play size={20} color="white" />}
              style={styles.startButton}
            />
            <Text style={[styles.startNote, { color: colors.textSecondary }]}>
              Make sure you have adequate space and equipment before starting
            </Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 40 : 20,
    paddingVertical: 16,
  },
  backButton: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: isTablet ? 40 : 20,
  },
  heroSection: {
    marginBottom: 32,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  workoutTitle: {
    fontSize: isTablet ? 32 : 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    lineHeight: isTablet ? 40 : 34,
  },
  workoutDescription: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-Regular',
    lineHeight: isTablet ? 26 : 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isTablet ? 16 : 12,
    marginBottom: 24,
  },
  statCard: {
    width: isTablet ? (width - 80 - 16) / 2 : (width - 40 - 12) / 2,
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
  },
  statValue: {
    fontSize: isTablet ? 24 : 20,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
  },
  progressText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  equipmentText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  exerciseNumber: {
    alignItems: 'center',
    gap: 4,
    minWidth: 32,
  },
  exerciseIndexText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    lineHeight: isTablet ? 20 : 18,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  exerciseStat: {
    fontSize: isTablet ? 12 : 11,
    fontFamily: 'Inter-Medium',
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  muscleGroupTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  muscleGroupText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  exerciseDetailButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: isTablet ? 12 : 11,
    fontFamily: 'Inter-Medium',
  },
  startSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  startButton: {
    width: '100%',
    marginBottom: 12,
  },
  startNote: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
