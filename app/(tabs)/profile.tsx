import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Button, TextInput, HelperText, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface UserPreferences {
  tone?: string;
  niche?: string;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('');
  const [niche, setNiche] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('tone, niche')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      
      if (data) {
        setTone(data.tone || '');
        setNiche(data.niche || '');
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError('Failed to load preferences');
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          tone: tone.trim(),
          niche: niche.trim(),
          updated_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;

      setSnackbarMessage('Preferences saved successfully!');
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile Settings</Text>
        
        <Text style={styles.subtitle}>Content Preferences</Text>
        
        <TextInput
          label="Writing Tone"
          value={tone}
          onChangeText={setTone}
          style={styles.input}
          placeholder="e.g., Professional, Casual, Humorous"
        />
        
        <TextInput
          label="Content Niche"
          value={niche}
          onChangeText={setNiche}
          style={styles.input}
          placeholder="e.g., Tech, Marketing, Personal Development"
        />

        {error ? (
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSavePreferences}
          loading={loading}
          style={styles.saveButton}
          labelStyle={styles.buttonText}
        >
          Save Preferences
        </Button>

        <Button
          mode="outlined"
          onPress={signOut}
          style={styles.signOutButton}
          labelStyle={styles.signOutButtonText}
        >
          Sign Out
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1DA1F2',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  input: {
    width: 350,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#000',
    width: 350,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  signOutButton: {
    width: 350,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    borderColor: '#fff',
  },
  signOutButtonText: {
    fontSize: 20,
    color: '#fff',
  },
}); 