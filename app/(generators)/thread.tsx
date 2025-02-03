import { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { TextInput, Button, Card, HelperText, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateThread } from '../../lib/openai';

export default function ThreadGeneratorScreen() {
  const { user } = useAuth();
  const [headline, setHeadline] = useState('');
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [threadLength, setThreadLength] = useState(5); // Default length

  const handleGenerate = async () => {
    if (!headline.trim()) {
      setError('Please enter a headline');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting thread generation...');
      const thread = await generateThread(headline.trim(), threadLength);
      setGeneratedThread(thread);
    } catch (err) {
      console.error('Error in handleGenerate:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate thread. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedThread.length || !user) return;

    try {
      const { error: saveError } = await supabase
        .from('saved_content')
        .insert([
          {
            user_id: user.id,
            content_type: 'thread',
            content: JSON.stringify(generatedThread),
            original_prompt: headline,
          },
        ]);

      if (saveError) throw saveError;
      
      setSnackbarMessage('Thread saved successfully!');
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Error saving thread:', err);
      setError('Failed to save thread. Please try again.');
    }
  };

  const handleClear = () => {
    setGeneratedThread([]);
    setHeadline('');
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Thread Generator</Text>
        <TextInput
          label="Headline"
          value={headline}
          onChangeText={setHeadline}
          style={styles.input}
        />
        <View style={styles.lengthContainer}>
          <Text style={styles.lengthLabel}>Thread Length: {threadLength}</Text>
          <View style={styles.lengthButtons}>
            <Button
              mode="contained"
              onPress={() => setThreadLength(Math.max(2, threadLength - 1))}
              style={styles.lengthButton}
              labelStyle={styles.buttonText}
            >
              -
            </Button>
            <Button
              mode="contained"
              onPress={() => setThreadLength(Math.min(10, threadLength + 1))}
              style={styles.lengthButton}
              labelStyle={styles.buttonText}
            >
              +
            </Button>
          </View>
        </View>
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
          Generate Thread
        </Button>
        {generatedThread.length > 0 && (
          <Card style={styles.resultCard}>
            <Card.Content>
              {generatedThread.map((tweet, index) => (
                <View key={index} style={styles.tweetContainer}>
                  <Text style={styles.tweetNumber}>Tweet {index + 1}</Text>
                  <Text style={styles.tweetText}>{tweet}</Text>
                </View>
              ))}
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
        )}
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
  tweetContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tweetNumber: {
    color: '#666',
    marginBottom: 4,
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
  lengthContainer: {
    width: 350,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lengthLabel: {
    color: '#fff',
    fontSize: 18,
  },
  lengthButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  lengthButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
  },
}); 