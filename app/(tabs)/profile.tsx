import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard as Edit3, Trophy, Target, Calendar, Heart, Activity, Bell, Moon, Globe, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  currentUser, 
  achievements, 
  workouts,
  getWorkoutsByCategory,
  formatDuration 
} from '../../data/demoData';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(colorScheme === 'dark');

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

  // Calculate user stats from demo data
  const totalWorkouts = workouts.length;
  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;
  const joinDate = new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const stats = [
    { label: 'Workouts', value: totalWorkouts.toString(), icon: Activity, color: colors.primary },
    { label: 'Achievements', value: unlockedAchievements.toString(), icon: Trophy, color: colors.accent },
    { label: 'Level', value: currentUser.fitnessLevel, icon: Target, color: colors.success },
    { label: 'Joined', value: joinDate, icon: Calendar, color: colors.error },
  ];

  const recentAchievements = achievements.filter(a => a.unlockedAt).slice(0, 3);

  const menuSections = [
    {
      title: 'Account',
      items: [
        { title: 'Edit Profile', icon: Edit3, onPress: () => {} },
        { title: 'Privacy Settings', icon: Shield, onPress: () => {} },
        { title: 'Language', icon: Globe, value: 'English', onPress: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { 
          title: 'Notifications', 
          icon: Bell, 
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        { 
          title: 'Dark Mode', 
          icon: Moon, 
          hasSwitch: true,
          switchValue: darkModeEnabled,
          onSwitchChange: setDarkModeEnabled,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { title: 'Help Center', icon: HelpCircle, onPress: () => {} },
        { title: 'Contact Support', icon: Settings, onPress: () => {} },
      ],
    },
  ];

  const renderMenuItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: colors.surface }]}>
          <item.icon size={20} color={colors.textSecondary} />
        </View>
        <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.value && (
          <Text style={[styles.menuItemValue, { color: colors.textSecondary }]}>
            {item.value}
          </Text>
        )}
        {item.hasSwitch ? (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={item.switchValue ? colors.primary : colors.textSecondary}
          />
        ) : (
          <ChevronRight size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.surface }]}>
            <Settings size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: colors.primary }]}>
                <Camera size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{currentUser.name}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{currentUser.email}</Text>
              <Text style={[styles.profileJoined, { color: colors.textSecondary }]}>
                Member since {new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={18} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Achievements</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsContainer}
          >
            {recentAchievements.map((achievement, index) => (
              <TouchableOpacity
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: achievement.unlockedAt ? 1 : 0.5,
                  }
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.unlockedAt ? colors.primary : colors.surface }
                ]}>
                  <Trophy 
                    size={24} 
                    color={achievement.unlockedAt ? 'white' : colors.textSecondary} 
                  />
                </View>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>
                  {achievement.name}
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                  {achievement.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={[styles.menuSectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map(renderMenuItem)}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  profileJoined: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  editButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  achievementsContainer: {
    paddingRight: 20,
  },
  achievementCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    alignItems: 'center',
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
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    paddingHorizontal: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  bottomPadding: {
    height: 20,
  },
});