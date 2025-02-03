import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Please log in to access the dashboard</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Link href="/(generators)/tweet" asChild>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Tweet Generator</Text>
              <Text style={styles.cardDescription}>
                Create engaging single tweets
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" style={styles.button} labelStyle={styles.buttonText}>
                Create Tweet
              </Button>
            </Card.Actions>
          </Card>
        </Link>

        <Link href="/(generators)/thread" asChild>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Thread Generator</Text>
              <Text style={styles.cardDescription}>
                Generate structured Twitter threads
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" style={styles.button} labelStyle={styles.buttonText}>
                Create Thread
              </Button>
            </Card.Actions>
          </Card>
        </Link>

        <Link href="/(generators)/bio" asChild>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Bio Generator</Text>
              <Text style={styles.cardDescription}>
                Create a compelling Twitter bio
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" style={styles.button} labelStyle={styles.buttonText}>
                Create Bio
              </Button>
            </Card.Actions>
          </Card>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1DA1F2', // Twitter blue
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '95%',
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DA1F2',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#000',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  loadingText: {
    fontSize: 20,
    color: '#fff',
  },
  errorText: {
    fontSize: 20,
    color: '#fff',
  },
});
