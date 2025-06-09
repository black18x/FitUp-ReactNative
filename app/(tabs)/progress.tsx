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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Calendar,
  Award,
  Target,
  Activity,
  Clock,
  Flame,
  ChevronRight,
  Trophy,
  Star,
  Zap,
} from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  dailyStats, 
  achievements, 
  currentUser,
  formatDuration,
  getDaysInPeriod,
  getStatsForPeriod,
  getAchievementIcon
} from '../../data/demoData';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const isLargeScreen = width > 1024;

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

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

  const periods = ['Week', 'Month', 'Year'];

  // Get stats for selected period
  const periodStats = getStatsForPeriod(selectedPeriod);
  
  const stats = [
    {
      id: 1,
      title: 'Workouts',
      value: periodStats.workouts.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Activity,
      color: colors.primary,
    },
    {
      id: 2,
      title: 'Calories',
      value: periodStats.calories.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Flame,
      color: colors.accent,
    },
    {
      id: 3,
      title: 'Duration',
      value: formatDuration(periodStats.duration),
      change: '+15%',
      changeType: 'positive' as const,
      icon: Clock,
      color: colors.success,
    },
    {
      id: 4,
      title: 'Avg Heart Rate',
      value: `${periodStats.heartRate} bpm`,
      change: '-2%',
      changeType: 'positive' as const,
      icon: Activity,
      color: colors.error,
    },
  ];

  const recentAchievements = achievements.slice(0, 3);

  // Generate chart data based on period stats
  const chartLabels = selectedPeriod === 'Week' 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : selectedPeriod === 'Month'
    ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    : ['Q1', 'Q2', 'Q3', 'Q4'];

  const stepsData = {
    labels: chartLabels,
    datasets: [
      {
        data: periodStats.data.slice(0, chartLabels.length).map(stat => stat.steps),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const workoutData = {
    labels: chartLabels,
    datasets: [
      {
        data: periodStats.data.slice(0, chartLabels.length).map(stat => stat.activeMinutes),
        color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
      },
    ],
  };

  const weeklyStats = [
    { label: 'Total Steps', value: '58,746', change: '+12%', icon: Activity, color: colors.primary },
    { label: 'Active Minutes', value: '255', change: '+8%', icon: Clock, color: colors.success },
    { label: 'Calories Burned', value: '2,140', change: '+15%', icon: Flame, color: colors.accent },
    { label: 'Workouts', value: '4', change: '+1', icon: Target, color: colors.error },
  ];

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.textSecondary,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.border,
      strokeWidth: 1,
    },
  };

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
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Progress</Text>
          <TouchableOpacity style={[styles.calendarButton, { backgroundColor: colors.surface }]}>
            <Calendar size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period ? colors.primary : colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color: selectedPeriod === period ? 'white' : colors.text,
                  }
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsGrid}>
          {weeklyStats.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                <Text style={[styles.statChange, { color: colors.success }]}>{stat.change}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Steps Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Daily Steps</Text>
            <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>This Week</Text>
          </View>
          <LineChart
            data={stepsData}
            width={width - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
        </View>

        {/* Workout Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Workout Duration</Text>
            <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>Minutes per day</Text>
          </View>
          <BarChart
            data={workoutData}
            width={width - 40}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={false}
            withInnerLines={false}
            yAxisSuffix="m"
            yAxisLabel=""
          />
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Achievements</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {recentAchievements.map((achievement, index) => (
            <TouchableOpacity
              key={achievement.id}
              style={[styles.achievementCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.achievementIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Trophy size={24} color={colors.primary} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>
                  {achievement.name}
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                  {achievement.description}
                </Text>
                <Text style={[styles.achievementDate, { color: colors.textSecondary }]}>
                  {achievement.unlockedAt}
                </Text>
              </View>
              <View style={styles.achievementBadge}>
                <Award size={20} color={colors.accent} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Goals</Text>
          
          <TouchableOpacity style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Daily Steps Goal</Text>
              <Text style={[styles.goalProgress, { color: colors.primary }]}>85%</Text>
            </View>
            <View style={[styles.goalProgressBar, { backgroundColor: colors.surface }]}>
              <View style={[styles.goalProgressFill, { backgroundColor: colors.primary, width: '85%' }]} />
            </View>
            <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
              8,547 / 10,000 steps today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Weekly Workout Goal</Text>
              <Text style={[styles.goalProgress, { color: colors.success }]}>100%</Text>
            </View>
            <View style={[styles.goalProgressBar, { backgroundColor: colors.surface }]}>
              <View style={[styles.goalProgressFill, { backgroundColor: colors.success, width: '100%' }]} />
            </View>
            <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
              4 / 4 workouts completed this week
            </Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 40 : 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontFamily: 'Inter-Bold',
  },
  calendarButton: {
    width: isTablet ? 52 : 44,
    height: isTablet ? 52 : 44,
    borderRadius: isTablet ? 26 : 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: isTablet ? 40 : 20,
    marginBottom: 24,
    gap: isTablet ? 12 : 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  periodText: {
    fontSize: 14,
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
    overflow: 'hidden',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  chartCard: {
    marginHorizontal: isTablet ? 40 : 20,
    borderRadius: 20,
    padding: isTablet ? 24 : 16,
    marginBottom: 24,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  section: {
    paddingHorizontal: isTablet ? 40 : 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontFamily: 'Inter-Bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    marginBottom: 4,
    lineHeight: 20,
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  achievementBadge: {
    padding: 8,
  },
  goalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  goalProgress: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  goalProgressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});