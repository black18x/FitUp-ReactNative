import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  X,
  Clock,
  Flame,
  Target,
  CheckCircle,
  Circle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { workouts, formatDuration } from '../../../data/demoData';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  // Session state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState<{[exerciseId: string]: number}>({});
  const [sessionStarted, setSessionStarted] = useState(false);

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
  useEffect(() => {
    let interval: any;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let interval: any;
    
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting, restTimer]);

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

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const currentExerciseCompletedSets = completedSets[currentExercise.id] || 0;
  const isCurrentSetCompleted = currentExerciseCompletedSets >= currentSet;
  const isExerciseCompleted = currentExerciseCompletedSets >= currentExercise.sets;
  const isWorkoutCompleted = currentExerciseIndex >= totalExercises - 1 && isExerciseCompleted;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setSessionStarted(true);
    setIsPlaying(true);
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCompleteSet = () => {
    const newCompletedSets = {
      ...completedSets,
      [currentExercise.id]: Math.max(currentExerciseCompletedSets, currentSet)
    };
    setCompletedSets(newCompletedSets);

    // Auto advance to next set or exercise
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      // Start rest timer if not the last set
      if (currentExercise.restTime > 0) {
        setRestTimer(currentExercise.restTime);
        setIsResting(true);
      }
    } else {
      // Exercise completed, move to next exercise
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTimer(0);
    } else {
      // Workout completed
      handleWorkoutComplete();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTimer(0);
    }
  };  const handleWorkoutComplete = () => {
    setIsPlaying(false);
    Alert.alert(
      'Workout Complete! 🎉',
      `Great job! You completed "${workout.name}" in ${formatTime(sessionTimer)}.`,
      [
        { text: 'View Summary', onPress: () => router.push(`/workout/summary/${id}` as any) },
        { text: 'Done', onPress: () => router.push('/(tabs)/workouts') }
      ]
    );
  };

  const handleQuitWorkout = () => {
    Alert.alert(
      'Quit Workout',
      'Are you sure you want to quit this workout? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Quit', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const progressPercentage = Math.round(
    ((currentExerciseIndex + (currentExerciseCompletedSets / currentExercise.sets)) / totalExercises) * 100
  );

  if (!sessionStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? ['#0F172A', '#1E293B', '#334155'] 
            : ['#FFFFFF', '#F8FAFC', '#F1F5F9']
          }
          style={styles.backgroundGradient}
        >
          <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
          
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={[styles.headerButton, { backgroundColor: colors.surface }]}
            >
              <ArrowLeft size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.preSessionContainer}>
            <Card variant="glass" style={styles.preSessionCard}>
              <Text style={[styles.workoutTitle, { color: colors.text }]}>
                {workout.name}
              </Text>
              <Text style={[styles.workoutDescription, { color: colors.textSecondary }]}>
                {workout.description}
              </Text>

              <View style={styles.preSessionStats}>
                <View style={styles.preSessionStat}>
                  <Clock size={20} color={colors.primary} />
                  <Text style={[styles.preSessionStatText, { color: colors.text }]}>
                    {formatDuration(workout.duration)}
                  </Text>
                </View>
                <View style={styles.preSessionStat}>
                  <Flame size={20} color={colors.accent} />
                  <Text style={[styles.preSessionStatText, { color: colors.text }]}>
                    {workout.calories} cal
                  </Text>
                </View>
                <View style={styles.preSessionStat}>
                  <Target size={20} color={colors.success} />
                  <Text style={[styles.preSessionStatText, { color: colors.text }]}>
                    {workout.exercises.length} exercises
                  </Text>
                </View>
              </View>              <Button
                title="Start Workout"
                onPress={handleStartSession}
                icon={<Play size={20} color="white" />}
                size="large"
                style={styles.startButton}
              />
            </Card>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? ['#0F172A', '#1E293B'] 
          : ['#FFFFFF', '#F8FAFC']
        }
        style={styles.backgroundGradient}
      >
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        
        {/* Header */}
        <View style={styles.sessionHeader}>
          <TouchableOpacity 
            onPress={handleQuitWorkout}
            style={[styles.headerButton, { backgroundColor: colors.surface }]}
          >
            <X size={20} color={colors.error} />
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: colors.text }]}>
              {formatTime(sessionTimer)}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handlePauseResume}
            style={[styles.headerButton, { backgroundColor: colors.primary }]}
          >
            {isPlaying ? (
              <Pause size={20} color="white" />
            ) : (
              <Play size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: colors.primary,
                  width: `${progressPercentage}%`
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Exercise {currentExerciseIndex + 1} of {totalExercises} • {progressPercentage}% Complete
          </Text>
        </View>

        {/* Rest Timer */}
        {isResting && (
          <Card variant="glass" style={styles.restContainer}>
            <Clock size={32} color={colors.accent} />
            <Text style={[styles.restTitle, { color: colors.text }]}>Rest Time</Text>
            <Text style={[styles.restTimerDisplay, { color: colors.accent }]}>
              {formatTime(restTimer)}
            </Text>
          </Card>
        )}

        {/* Current Exercise */}
        <View style={styles.exerciseContainer}>
          <Card variant="default" style={styles.exerciseCard}>
            <Text style={[styles.exerciseName, { color: colors.text }]}>
              {currentExercise.name}
            </Text>
            <Text style={[styles.exerciseDescription, { color: colors.textSecondary }]}>
              {currentExercise.description}
            </Text>

            <View style={styles.setProgress}>
              <Text style={[styles.setProgressText, { color: colors.text }]}>
                Set {currentSet} of {currentExercise.sets}
              </Text>
              <Text style={[styles.repsText, { color: colors.primary }]}>
                {currentExercise.reps} reps
              </Text>
            </View>

            {/* Sets Display */}
            <View style={styles.setsContainer}>
              {Array.from({ length: currentExercise.sets }, (_, index) => {
                const setNumber = index + 1;
                const isCompleted = currentExerciseCompletedSets >= setNumber;
                const isCurrent = setNumber === currentSet;
                
                return (
                  <View
                    key={setNumber}
                    style={[
                      styles.setIndicator,
                      {
                        backgroundColor: isCompleted 
                          ? colors.success 
                          : isCurrent 
                            ? colors.primary 
                            : colors.surface,
                        borderColor: isCurrent ? colors.primary : 'transparent',
                      }
                    ]}
                  >
                    {isCompleted ? (
                      <CheckCircle size={16} color="white" />
                    ) : (
                      <Text style={[
                        styles.setIndicatorText,
                        { color: isCurrent ? 'white' : colors.textSecondary }
                      ]}>
                        {setNumber}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
            style={[
              styles.controlButton,
              { 
                backgroundColor: currentExerciseIndex === 0 ? colors.surface : colors.secondary,
                opacity: currentExerciseIndex === 0 ? 0.5 : 1
              }
            ]}
          >
            <RotateCcw size={20} color="white" />
            <Text style={styles.controlButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCompleteSet}
            style={[styles.completeButton, { backgroundColor: colors.success }]}
            disabled={isCurrentSetCompleted}
          >
            <CheckCircle size={24} color="white" />
            <Text style={styles.completeButtonText}>
              {isCurrentSetCompleted ? 'Set Complete' : 'Complete Set'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextExercise}
            disabled={currentExerciseIndex >= totalExercises - 1}
            style={[
              styles.controlButton,
              { 
                backgroundColor: currentExerciseIndex >= totalExercises - 1 ? colors.surface : colors.secondary,
                opacity: currentExerciseIndex >= totalExercises - 1 ? 0.5 : 1
              }
            ]}
          >
            <SkipForward size={20} color="white" />
            <Text style={styles.controlButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 40 : 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: isTablet ? 28 : 24,
    fontFamily: 'Inter-Bold',
  },
  progressContainer: {
    paddingHorizontal: isTablet ? 40 : 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  preSessionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: isTablet ? 40 : 20,
  },
  preSessionCard: {
    padding: isTablet ? 32 : 24,
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: isTablet ? 28 : 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  workoutDescription: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: isTablet ? 24 : 20,
  },
  preSessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  preSessionStat: {
    alignItems: 'center',
    gap: 8,
  },
  preSessionStatText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-SemiBold',
  },
  startButton: {
    width: '100%',
  },
  restContainer: {
    marginHorizontal: isTablet ? 40 : 20,
    marginBottom: 20,
    padding: isTablet ? 32 : 24,
    alignItems: 'center',
  },
  restTitle: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 12,
    marginBottom: 8,
  },
  restTimerDisplay: {
    fontSize: isTablet ? 36 : 32,
    fontFamily: 'Inter-Bold',
  },
  exerciseContainer: {
    flex: 1,
    paddingHorizontal: isTablet ? 40 : 20,
  },
  exerciseCard: {
    padding: isTablet ? 32 : 24,
    flex: 1,
  },
  exerciseName: {
    fontSize: isTablet ? 24 : 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  exerciseDescription: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: isTablet ? 24 : 20,
  },
  setProgress: {
    alignItems: 'center',
    marginBottom: 24,
  },
  setProgressText: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  repsText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
  },
  setsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  setIndicator: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  setIndicatorText: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: isTablet ? 40 : 20,
    paddingVertical: 20,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  controlButtonText: {
    color: 'white',
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-SemiBold',
  },
  completeButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-SemiBold',
  },
});
