import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Card, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import * as Clipboard from 'expo-clipboard';

interface SavedContent {
  id: string;
  content_type: 'tweet' | 'thread' | 'bio';
  content: string;
  original_prompt: string;
  created_at: string;
}

export default function SavedScreen() {
  const { user } = useAuth();
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadSavedContent();
  }, [user]);

  const loadSavedContent = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('saved_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSavedContent(data || []);
    } catch (err) {
      console.error('Error loading saved content:', err);
      setError('Failed to load saved content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async (content: string) => {
    try {
      await Clipboard.setStringAsync(content);
      setSnackbarMessage('Copied to clipboard!');
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      setError('Failed to copy to clipboard');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('saved_content')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSavedContent(prev => prev.filter(item => item.id !== id));
      setSnackbarMessage('Content deleted successfully!');
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Error deleting content:', err);
      setError('Failed to delete content');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Saved Content</Text>

          {savedContent.length === 0 ? (
            <Text style={styles.emptyText}>No saved content yet</Text>
          ) : (
            savedContent.map((item) => (
              <Card key={item.id} style={styles.card}>
                <Card.Content>
                  <Text style={styles.contentType}>
                    {item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)}
                  </Text>
                  <Text style={styles.contentText}>
                    {item.content_type === 'thread'
                      ? JSON.parse(item.content).join('\n\n')
                      : item.content}
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => handleCopyToClipboard(item.content)}>
                    Copy
                  </Button>
                  <Button onPress={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </Card.Actions>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1DA1F2', // Twitter blue
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 4,
    borderRadius: 12,
    width: '95%',
  },
  contentType: {
    color: '#666',
    marginBottom: 8,
  },
  contentText: {
    lineHeight: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 32,
  },
}); 