import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../src/config/firebase';
import { useAppContext } from '../../src/context/AppContext';
import { LogOut, Key, User, Shield, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, useSharedValue, withRepeat, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import BackgroundAnimation from '../../src/components/BackgroundAnimation';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SettingsScreen() {
  const { apiKey, setApiKey } = useAppContext();
  const [tempKey, setTempKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedAura = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.3,
  }));

  const handleSave = async () => {
    await setApiKey(tempKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundAnimation />

      <View style={styles.auraWrapper}>
        <Animated.View style={[styles.auraCircle, animatedAura]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
          <Text style={styles.tag}>CONFIGURATION</Text>
          <Text style={styles.title}>SETTINGS</Text>
        </Animated.View>

        <View style={styles.sections}>
          {/* API Key Section */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Key size={14} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>NEURAL ACCESS KEY</Text>
            </View>
            <BlurView intensity={20} tint="dark" style={styles.glassCard}>
              <TextInput
                style={styles.input}
                value={tempKey}
                onChangeText={setTempKey}
                placeholder="Enter AI API Key"
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <LinearGradient
                  colors={saved ? ['#10b981', '#059669'] : ['#fff', '#e2e8f0']}
                  style={styles.saveGradient}
                >
                  <Text style={[styles.saveText, saved && { color: '#fff' }]}>{saved ? 'SYNCED' : 'UPDATE'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          {/* User Profile Info */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={14} color="rgba(255,255,255,0.4)" />
              <Text style={styles.sectionLabel}>IDENTITY FIELD</Text>
            </View>
            <BlurView intensity={10} tint="dark" style={styles.glassRow}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Primary Email</Text>
                <Text style={styles.rowValue}>{auth.currentUser?.email}</Text>
              </View>
              <Shield size={18} color="rgba(255,255,255,0.2)" />
            </BlurView>
          </Animated.View>

          {/* Danger Zone */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <BlurView intensity={30} tint="dark" style={styles.logoutBlur}>
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>TERMINATE SESSION</Text>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  auraWrapper: {
    position: 'absolute',
    top: height * 0.1,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  auraCircle: {
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    gap: 40,
  },
  header: {
    gap: 4,
  },
  tag: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 4,
  },
  title: {
    fontSize: 54,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -4,
  },
  sections: {
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 10,
    paddingLeft: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
  },
  glassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  rowInfo: {
    gap: 4,
  },
  rowLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  logoutBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 20,
  },
  logoutBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  }
});
