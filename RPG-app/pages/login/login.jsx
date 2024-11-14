import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      navigation.navigate('Home');
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  const handleForgotPassword = () => {
    alert('Recuperação de senha não implementada ainda.');
  };

  return (
    <ImageBackground
      source={require('../../Imagem/Fundo.jpg')} // Verifique se o caminho da imagem está correto
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome de Usuário"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // A imagem cobre a tela inteira
    justifyContent: 'center', // Centraliza o conteúdo na vertical
    alignItems: 'center', // Centraliza o conteúdo na horizontal
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Leve escurecimento para melhorar contraste do texto
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordText: {
    marginTop: 20,
    color: '#FFF',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  registerText: {
    marginTop: 10,
    color: '#FFF',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default Login;
