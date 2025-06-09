import React, { useState } from 'react';
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
  Pause,
  RotateCcw,
  Clock,
  Target,
  Info,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { exercises } from '../../data/demoData';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);

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

  // Find the exercise by ID
  const exercise = exercises.find(e => e.id === id);

  if (!exercise) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Exercise not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleSetComplete = (setNumber: number) => {
    if (completedSets.includes(setNumber)) {
      setCompletedSets(prev => prev.filter(s => s !== setNumber));
    } else {
      setCompletedSets(prev => [...prev, setNumber]);
      
      // Auto-start rest timer if not the last set
      if (setNumber < exercise.sets && exercise.restTime > 0) {
        startRestTimer();
      }
    }
  };

  const startRestTimer = () => {
    setIsResting(true);
    setRestTimer(exercise.restTime);
    
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset your progress for this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setCompletedSets([]);
            setCurrentSet(1);
            setIsResting(false);
            setRestTimer(0);
          }
        }
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionPercentage = Math.round((completedSets.length / exercise.sets) * 100);

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

          <TouchableOpacity 
            onPress={resetProgress}
            style={[styles.resetButton, { backgroundColor: colors.surface }]}
          >
            <RotateCcw size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === 'ios' ? 100 : 80 }
          ]}
        >
          {/* Exercise Info */}
          <View style={styles.heroSection}>
            <Text style={[styles.exerciseTitle, { color: colors.text }]}>
              {exercise.name}
            </Text>
            <Text style={[styles.exerciseDescription, { color: colors.textSecondary }]}>
              {exercise.description}
            </Text>

            {/* Progress */}
            {completedSets.length > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressText, { color: colors.text }]}>
                    Progress: {completedSets.length}/{exercise.sets} sets
                  </Text>
                  <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                    {completionPercentage}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.primary,
                        width: `${completionPercentage}%`
                      }
                    ]} 
                  />
                </View>
              </View>
            )}

            {/* Rest Timer */}
            {isResting && (
              <Card variant="glass" style={styles.restCard}>
                <Clock size={24} color={colors.accent} />
                <Text style={[styles.restTitle, { color: colors.text }]}>Rest Time</Text>
                <Text style={[styles.restTimer, { color: colors.accent }]}>
                  {formatTime(restTimer)}
                </Text>
                <Text style={[styles.restSubtitle, { color: colors.textSecondary }]}>
                  Take a break and prepare for the next set
                </Text>
              </Card>
            )}
          </View>

          {/* Exercise Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <Card variant="glass" style={styles.statCard}>
                <Target size={20} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {exercise.sets}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sets</Text>
              </Card>

              <Card variant="glass" style={styles.statCard}>
                <Target size={20} color={colors.success} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {exercise.reps}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reps</Text>
              </Card>

              <Card variant="glass" style={styles.statCard}>
                <Clock size={20} color={colors.accent} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {exercise.restTime}s
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rest</Text>
              </Card>
            </View>
          </View>

          {/* Sets Tracker */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sets</Text>
            <View style={styles.setsGrid}>
              {Array.from({ length: exercise.sets }, (_, index) => {
                const setNumber = index + 1;
                const isCompleted = completedSets.includes(setNumber);
                
                return (
                  <TouchableOpacity
                    key={setNumber}
                    style={[
                      styles.setCard,
                      {
                        backgroundColor: isCompleted ? colors.primary : colors.surface,
                        borderColor: isCompleted ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => handleSetComplete(setNumber)}
                  >
                    {isCompleted ? (
                      <CheckCircle size={24} color="white" />
                    ) : (
                      <Circle size={24} color={colors.textSecondary} />
                    )}
                    <Text style={[
                      styles.setNumber,
                      { color: isCompleted ? 'white' : colors.text }
                    ]}>
                      Set {setNumber}
                    </Text>
                    <Text style={[
                      styles.setReps,
                      { color: isCompleted ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                    ]}>
                      {exercise.reps} reps
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Muscle Groups */}
          {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Target Muscles</Text>
              <View style={styles.muscleGroupsList}>
                {exercise.muscleGroups.map((group, index) => (
                  <View key={index} style={[styles.muscleGroupCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.muscleGroupText, { color: colors.text }]}>{group}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.instructionsHeader}
              onPress={() => setShowInstructions(!showInstructions)}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
              {showInstructions ? (
                <ChevronUp size={20} color={colors.textSecondary} />
              ) : (
                <ChevronDown size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>

            {showInstructions && (
              <Card variant="default" style={styles.instructionsCard}>
                {exercise.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={[styles.instructionNumber, { backgroundColor: colors.primary }]}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.instructionText, { color: colors.text }]}>
                      {instruction}
                    </Text>
                  </View>
                ))}
              </Card>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>            <Button
              title={`Start ${exercise.name}`}
              onPress={() => {
                Alert.alert(
                  'Start Exercise',
                  `Ready to start ${exercise.name}? Track your sets as you complete them.`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Start', onPress: () => console.log('Starting exercise...') }
                  ]
                );
              }}
              icon={<Play size={20} color="white" />}
              size="large"
              style={styles.startButton}
            />
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
  resetButton: {
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
  exerciseTitle: {
    fontSize: isTablet ? 28 : 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    lineHeight: isTablet ? 36 : 30,
  },
  exerciseDescription: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    lineHeight: isTablet ? 24 : 20,
    marginBottom: 24,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
  },
  progressPercentage: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  restCard: {
    alignItems: 'center',
    padding: isTablet ? 24 : 20,
    marginTop: 16,
  },
  restTitle: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    marginBottom: 4,
  },
  restTimer: {
    fontSize: isTablet ? 32 : 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  restSubtitle: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: isTablet ? 16 : 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
  },
  statValue: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 12 : 11,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  setsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isTablet ? 12 : 8,
  },
  setCard: {
    width: isTablet ? (width - 80 - 24) / 3 : (width - 40 - 16) / 3,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
  },
  setNumber: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
  },
  setReps: {
    fontSize: isTablet ? 12 : 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  muscleGroupsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleGroupCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  muscleGroupText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionsCard: {
    padding: isTablet ? 24 : 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  instructionText: {
    flex: 1,
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    lineHeight: isTablet ? 24 : 20,
  },
  actionsSection: {
    paddingVertical: 20,
  },
  startButton: {
    width: '100%',
  },
});
