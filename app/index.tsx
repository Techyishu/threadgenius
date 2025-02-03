import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>ThreadGenius</Text>
        <Link href="/auth/signup" asChild>
          <Button mode="contained" style={styles.signupButton} labelStyle={styles.signupButtonText}>
            Sign Up
          </Button>
        </Link>
        <Text style={styles.memberText}>Already a member?</Text>
        <Link href="/auth/login" asChild>
          <Button mode="contained" style={styles.loginButton} labelStyle={styles.loginButtonText}>
            Log In
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1DA1F2', // Twitter blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#fff',
  },
  signupButton: {
    backgroundColor: '#000',
    width: 300,
    height: 60,
    marginBottom: 20,
    borderRadius: 30,
    justifyContent: 'center',
  },
  signupButtonText: {
    fontSize: 20,
    color: '#fff', // Set text color to white
  },
  memberText: {
    marginBottom: 10,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#fff',
    width: 300,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 20,
    color: '#000',
  },
}); 