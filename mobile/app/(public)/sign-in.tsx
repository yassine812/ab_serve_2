import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Button, HelperText, Surface, Text, TextInput } from 'react-native-paper';

import { useAuthSession } from '../../src/hooks/useAuthSession';

export default function SignInScreen() {
  const { signIn, isSigningIn } = useAuthSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!username.trim() || !password) {
      setError('Renseigne ton nom d utilisateur et ton mot de passe.');
      return;
    }

    try {
      await signIn(username.trim(), password);
    } catch (err) {
      setError('Connexion impossible. Verifie les identifiants et l URL API.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#EFF3F6', justifyContent: 'center', padding: 20 }}
    >
      <Surface style={{ borderRadius: 24, padding: 24, backgroundColor: '#FFFFFF' }} elevation={1}>
        <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
          AB Serve Mobile
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 20, color: '#52606D' }}>
          Connecte-toi pour consulter les missions et lancer les controles terrain.
        </Text>

        <TextInput
          mode="outlined"
          label="Nom d utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ marginBottom: 12 }}
        />

        <TextInput
          mode="outlined"
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <HelperText type="error" visible={Boolean(error)}>
          {error ?? ' '}
        </HelperText>

        <Button mode="contained" onPress={handleSubmit} loading={isSigningIn} disabled={isSigningIn}>
          Se connecter
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}
