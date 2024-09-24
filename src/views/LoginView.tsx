import React from 'react';
import {Text, TextInput, View, Pressable} from 'react-native';

interface LoginState {
  username: String;
  password: String;
  usernameError: boolean;
  passwordError: boolean;
  serverError: boolean;
  authError: boolean;
}

class LoginView extends React.Component<{navigation: any}> {
  state: LoginState = {
    username: '',
    password: '',
    usernameError: false,
    passwordError: false,
    serverError: false,
    authError: false,
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
  login = async (): Promise<void> => {
    const credentials = await this.fetchCredentials();

    if (!credentials) {
      this.setState({serverError: true});
      return;
    }

    if (!this.state.username) {
      this.setState({usernameError: true});
      return;
    }

    if (!this.state.password) {
      this.setState({passwordError: true});
      return;
    }

    if (
      credentials.username === this.state.username &&
      credentials.password === this.state.password
    ) {
      this.setState({
        username: '',
        password: '',
        usernameError: false,
        passwordError: false,
        serverError: false,
        authError: false,
      });
      this.props.navigation.navigate('MainView');
    } else {
      this.setState({authError: true});
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
      <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            margin: 10,
          }}>
          Enter your credentials
        </Text>
        <TextInput
          placeholder="Insert username"
          onChangeText={val => this.handleInputChange('username', val.trim())}
          style={{
            borderColor: 'gray',
            width: '100%',
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 5,
          }}
        />
        {this.state.usernameError ? (
          <Text style={{color: 'red', textAlign: 'center'}}>
            Invalid username
          </Text>
        ) : null}
        <TextInput
          placeholder="Insert password"
          onChangeText={val => this.handleInputChange('password', val.trim())}
          secureTextEntry
          style={{
            borderColor: 'gray',
            width: '100%',
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 5,
          }}
        />
        {this.state.passwordError ? (
          <Text style={{color: 'red', textAlign: 'center'}}>
            Invalid password
          </Text>
        ) : null}
        <Pressable
          onPress={() => this.login()}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 4,
            elevation: 3,
            backgroundColor: 'green',
            marginTop: 25,
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Login</Text>
        </Pressable>
        {this.state.serverError ? (
          <Text style={{color: 'red', textAlign: 'center'}}>Server error</Text>
        ) : null}
        {this.state.authError ? (
          <Text style={{color: 'red', textAlign: 'center'}}>
            Authentication error
          </Text>
        ) : null}
      </View>
    );
  }
}

export default LoginView;
