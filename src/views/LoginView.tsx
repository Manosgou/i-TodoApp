import React from 'react';
import {Text, TextInput, SafeAreaView, Button} from 'react-native';

interface LoginState {
  username: String;
  password: String;
}

class LoginView extends React.Component<{navigation: any}> {
  state: LoginState = {
    username: '',
    password: '',
  };

  fetchCredentials = async () => {
    return fetch('https://scmscore.i-magic.gr/uploads/rn/auth')
      .then(res => res.json())
      .then(res => {
        return res;
      })
      .catch(error => {
        console.error(error);
      });
  };
  login = async () => {
    const credentials = await this.fetchCredentials();

    if (!credentials) {
      return;
    }

    if (
      credentials.username === this.state.username &&
      credentials.password === this.state.password
    ) {
      this.props.navigation.navigate('MainView');
    }
  };

  handleInputChange = (inputName: string, inputValue: string) => {
    this.setState(state => ({
      ...state,
      [inputName]: inputValue,
    }));
  };

  render(): React.ReactNode {
    return (
      <SafeAreaView>
        <Text>Enter your credentials</Text>
        <TextInput
          placeholder="Inser username"
          onChangeText={val => this.handleInputChange('username', val.trim())}
        />
        <TextInput
          placeholder="Inser password"
          onChangeText={val => this.handleInputChange('password', val.trim())}
        />
        <Button title="Login " onPress={() => this.login()} />
      </SafeAreaView>
    );
  }
}

export default LoginView;
