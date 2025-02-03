import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { TextInput, Button, Card, HelperText, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateBio } from '../../lib/openai';

export default function BioGeneratorScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedBio, setGeneratedBio] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Form fields
  const [intro, setIntro] = useState('');
  const [niche, setNiche] = useState('');
  const [whatTheyDo, setWhatTheyDo] = useState('');

  const handleGenerate = async () => {
    if (!intro.trim() || !niche.trim() || !whatTheyDo.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting bio generation...');
      const bio = await generateBio({
        intro: intro.trim(),
        niche: niche.trim(),
        whatTheyDo: whatTheyDo.trim(),
      });
      
      setGeneratedBio(bio);
    } catch (err) {
      console.error('Error in handleGenerate:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate bio. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedBio || !user) return;

    try {
      const { error: saveError } = await supabase
        .from('saved_content')
        .insert([
          {
            user_id: user.id,
            content_type: 'bio',
            content: generatedBio,
            original_prompt: JSON.stringify({ intro, niche, whatTheyDo }),
          },
        ]);

      if (saveError) throw saveError;
      
      setSnackbarMessage('Bio saved successfully!');
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Error saving bio:', err);
      setError('Failed to save bio. Please try again.');
    }
  };

  const handleClear = () => {
    setIntro('');
    setNiche('');
    setWhatTheyDo('');
    setGeneratedBio('');
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bio Generator</Text>
        <TextInput
          label="Intro"
          value={intro}
          onChangeText={setIntro}
          style={styles.input}
        />
        <TextInput
          label="Niche"
          value={niche}
          onChangeText={setNiche}
          style={styles.input}
        />
        <TextInput
          label="What They Do"
          value={whatTheyDo}
          onChangeText={setWhatTheyDo}
          style={styles.input}
        />
        {error ? (
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        ) : null}
        <Button
          mode="contained"
          onPress={handleGenerate}
          loading={loading}
          disabled={loading || !intro.trim() || !niche.trim() || !whatTheyDo.trim()}
          style={styles.generateButton}
          labelStyle={styles.buttonText}
        >
          Generate Bio
        </Button>
        {generatedBio ? (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text style={styles.bioText}>{generatedBio}</Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={handleSave} 
                disabled={loading}
                style={styles.actionButton}
                labelStyle={styles.buttonText}
              >
                Save
              </Button>
              <Button 
                mode="outlined" 
                onPress={handleClear} 
                disabled={loading}
                style={styles.actionButton}
                labelStyle={styles.clearButtonText}
              >
                Clear
              </Button>
            </Card.Actions>
          </Card>
        ) : null}
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
    backgroundColor: '#1DA1F2', // Twitter blue
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
  input: {
    width: 350,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  generateButton: {
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
  resultCard: {
    backgroundColor: '#fff',
    elevation: 4,
    borderRadius: 12,
    width: '95%',
    marginBottom: 20,
  },
  bioText: {
    lineHeight: 24,
  },
  actionButton: {
    marginHorizontal: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#1DA1F2', // Twitter blue
  },
}); 