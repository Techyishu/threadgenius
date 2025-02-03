import { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { TextInput, Button, Card, HelperText, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateTweet } from '../../lib/openai';

export default function TweetGeneratorScreen() {
  const { user } = useAuth();
  const [headline, setHeadline] = useState('');
  const [generatedTweet, setGeneratedTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGenerate = async () => {
    if (!headline.trim()) {
      setError('Please enter a headline');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting tweet generation...');
      const tweet = await generateTweet(headline.trim());
      setGeneratedTweet(tweet);
    } catch (err) {
      console.error('Error in handleGenerate:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate tweet. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedTweet || !user) return;

    try {
      const { error: saveError } = await supabase
        .from('saved_content')
        .insert([
          {
            user_id: user.id,
            content_type: 'tweet',
            content: generatedTweet,
            original_prompt: headline,
          },
        ]);

      if (saveError) throw saveError;
      
      setSnackbarMessage('Tweet saved successfully!');
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Error saving tweet:', err);
      setError('Failed to save tweet. Please try again.');
    }
  };

  const handleClear = () => {
    setGeneratedTweet('');
    setHeadline('');
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tweet Generator</Text>
        <TextInput
          label="Headline"
          value={headline}
          onChangeText={setHeadline}
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
          disabled={loading || !headline.trim()}
          style={styles.generateButton}
          labelStyle={styles.buttonText}
        >
          Generate Tweet
        </Button>
        {generatedTweet ? (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text style={styles.tweetText}>{generatedTweet}</Text>
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
    width: 350, // Increased width
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  generateButton: {
    backgroundColor: '#000',
    width: 350, // Increased width
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff', // Ensure text is visible
  },
  resultCard: {
    backgroundColor: '#fff',
    elevation: 4,
    borderRadius: 12,
    width: '95%',
    marginBottom: 20,
  },
  tweetText: {
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