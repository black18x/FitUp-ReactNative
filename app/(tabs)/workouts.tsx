import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Search,
  Play,
  Clock,
  Flame,
  Target,
  Dumbbell,
  Heart,
  Zap,
  Users,
  Star,
} from 'lucide-react-native';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  workouts, 
  getWorkoutsByCategory, 
  searchWorkouts, 
  formatDuration, 
  getDifficultyColor 
} from '../../data/demoData';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function WorkoutsScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const colors = {
    primary: '#10B981',
    secondary: '#64748B',
    accent: '#F97316',
    background: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
    surface: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
    card: colorScheme === 'dark' ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    text: colorScheme === 'dark' ? '#F1F5F9' : '#0F172A',
    textSecondary: colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    border: colorScheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.3)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const filteredWorkouts = searchQuery.trim()
    ? searchWorkouts(searchQuery)
    : getWorkoutsByCategory(selectedCategory);

  const categories = [
    { name: 'All', icon: Target, color: colors.primary },
    { name: 'Strength', icon: Dumbbell, color: colors.accent },
    { name: 'Cardio', icon: Heart, color: colors.error },
    { name: 'HIIT', icon: Zap, color: colors.warning },
    { name: 'Yoga', icon: Users, color: colors.success },
  ];

  const handleWorkoutPress = (workout: any) => {
    router.push(`/workout/${workout.id}`);
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.name === category);
    if (categoryObj) {
      const IconComponent = categoryObj.icon;
      return <IconComponent size={16} color={categoryObj.color} />;
    }
    return <Target size={16} color={colors.primary} />;
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Workouts
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {filteredWorkouts.length} workouts available
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search workouts..."
            leftIcon={Search}
          />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.name 
                    ? category.color 
                    : colors.card,
                  borderColor: category.color,
                }
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <category.icon 
                size={16} 
                color={selectedCategory === category.name ? '#FFFFFF' : category.color} 
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.name 
                      ? '#FFFFFF' 
                      : colors.text,
                  }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Workout */}
        {filteredWorkouts.length > 0 && selectedCategory === 'All' && !searchQuery && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Workout
            </Text>
            <Card variant="glass" padding="large">
              <TouchableOpacity
                style={styles.featuredWorkout}
                onPress={() => handleWorkoutPress(filteredWorkouts[0])}
              >
                <View style={styles.featuredContent}>
                  <Text style={[styles.featuredTitle, { color: colors.text }]}>
                    {filteredWorkouts[0]?.name}
                  </Text>
                  <Text style={[styles.featuredDescription, { color: colors.textSecondary }]}>
                    {filteredWorkouts[0]?.description}
                  </Text>
                  
                  <View style={styles.featuredStats}>
                    <View style={styles.statItem}>
                      <Clock size={16} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {formatDuration(filteredWorkouts[0]?.duration || 0)}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Flame size={16} color={colors.warning} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {filteredWorkouts[0]?.calories} cal
                      </Text>
                    </View>
                    <View 
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor: `${getDifficultyColor(filteredWorkouts[0]?.difficulty || 'Easy')}20`
                        }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.difficultyText,
                          {
                            color: getDifficultyColor(filteredWorkouts[0]?.difficulty || 'Easy')
                          }
                        ]}
                      >
                        {filteredWorkouts[0]?.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>
                  <Button
                  variant="primary"
                  size="medium"
                  title="Start Workout"
                  onPress={() => handleWorkoutPress(filteredWorkouts[0])}
                />
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* Workouts Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Popular Workouts' : `${selectedCategory} Workouts`}
          </Text>
          
          <View style={[styles.workoutsGrid, isTablet && styles.workoutsGridTablet]}>
            {filteredWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={[styles.workoutCard, isTablet && styles.workoutCardTablet]}
                onPress={() => handleWorkoutPress(workout)}
              >
                <Card variant="default" padding="medium">
                  <View style={styles.workoutHeader}>
                    <View style={styles.workoutInfo}>
                      {getCategoryIcon(workout.category)}
                      <Text style={[styles.workoutCategory, { color: colors.textSecondary }]}>
                        {workout.category}
                      </Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color={colors.warning} fill={colors.warning} />
                      <Text style={[styles.rating, { color: colors.textSecondary }]}>
                        {workout.rating}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.workoutTitle, { color: colors.text }]}>
                    {workout.name}
                  </Text>
                  <Text style={[styles.workoutDescription, { color: colors.textSecondary }]}>
                    {workout.description}
                  </Text>
                  
                  <View style={styles.workoutStats}>
                    <View style={styles.statItem}>
                      <Clock size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {formatDuration(workout.duration)}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Flame size={14} color={colors.warning} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {workout.calories} cal
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.workoutFooter}>
                    <View 
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor: `${getDifficultyColor(workout.difficulty)}20`
                        }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.difficultyText,
                          {
                            color: getDifficultyColor(workout.difficulty)
                          }
                        ]}
                      >
                        {workout.difficulty}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      style={[styles.playButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleWorkoutPress(workout)}
                    >
                      <Play size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Start */}
        {filteredWorkouts.length > 0 && (
          <View style={styles.quickStartContainer}>            <Button
              variant="outline"
              size="large"
              title="Quick Start Random Workout"
              onPress={() => handleWorkoutPress(filteredWorkouts[Math.floor(Math.random() * filteredWorkouts.length)])}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuredWorkout: {
    gap: 16,
  },
  featuredContent: {
    gap: 12,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  featuredDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  workoutsGrid: {
    gap: 16,
  },
  workoutsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workoutCard: {
    flex: 1,
  },
  workoutCardTablet: {
    width: '48%',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutCategory: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickStartContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickStartText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
