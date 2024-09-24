import React from 'react';
import {View, Text, Pressable, TextInput, Switch} from 'react-native';
import DatePicker from 'react-native-date-picker';
import notifee from '@notifee/react-native';
import {TodosContext} from '../context';

interface IProps {
  task_id: String;
  title: String;
  hasReminder: boolean;
  date: String;
}

interface IState {
  title: String;
  date: String;
  hasReminder: boolean;
  update: boolean;
  datepickerIsVisible: boolean;
  dateError: boolean;
}

class TaskListItem extends React.Component<IProps> {
  static contextType = TodosContext;

  state: IState = {
    title: this.props.title,
    date: this.props.date,
    hasReminder: this.props.hasReminder,
    update: false,
    datepickerIsVisible: false,
    dateError: false,
  };

  handleInputChange = (inputName: string, inputValue: string) => {
    this.setState(state => ({
      ...state,
      [inputName]: inputValue,
    }));
  };
  render(): React.ReactNode {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          borderColor: 'gray',
          borderWidth: 0.2,
        }}>
        {this.state.update ? (
          <View>
            <TextInput
              placeholder="Add a title"
              value={this.state.title}
              onChangeText={value => this.handleInputChange('title', value)}
              style={{
                borderColor: 'gray',
                width: 200,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
              }}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Remind me:</Text>
              <Switch
                value={this.state.hasReminder}
                onValueChange={value => {
                  this.setState({
                    hasReminder: value,
                    date: value ? this.state.date : null,
                  });
                }}
              />
            </View>
            {this.state.hasReminder ? (
              <View>
                <DatePicker
                  style={{width: 250, height: 200}}
                  date={
                    this.state.date
                      ? new Date(this.state.date.toString())
                      : new Date()
                  }
                  onDateChange={value => {
                    this.setState({date: value});
                  }}
                />
                {this.state.dateError ? (
                  <Text style={{color: 'red'}}>
                    Reminder date must be grater than the current date
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : (
          <View>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Title:</Text>
            <Text>{this.props.title}</Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'column',
          }}>
          {this.state.update ? (
            <Pressable
              onPress={() => {
                if (
                  this.state.hasReminder &&
                  new Date(this.state.date.toString()) <= new Date()
                ) {
                  this.setState({dateError: true});
                  return;
                }

                this.context.updateTask(
                  this.props.task_id,
                  this.state.title,
                  this.state.date,
                  this.state.hasReminder,
                );
                this.setState({update: false});
              }}
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
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontWeight: 'bold',
                  letterSpacing: 0.25,
                  color: 'white',
                }}>
                Save
              </Text>
            </Pressable>
          ) : null}
          <View style={{padding: 10}}>
            <Pressable
              onPress={() => this.setState({update: !this.state.update})}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 4,
                elevation: 3,
                backgroundColor: !this.state.update ? 'blue' : 'red',
                marginTop: 2,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontWeight: 'bold',
                  letterSpacing: 0.25,
                  color: 'white',
                }}>
                {!this.state.update ? 'Update' : 'Cancel'}
              </Text>
            </Pressable>
            {!this.state.update ? (
              <Pressable
                onPress={async () => {
                  if (this.state.hasReminder) {
                    await notifee.cancelTriggerNotification(
                      this.props.task_id.toString(),
                    );
                  }
                  this.context.deleteTask(this.props.task_id);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                  borderRadius: 4,
                  elevation: 3,
                  backgroundColor: 'red',
                  marginTop: 25,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    letterSpacing: 0.25,
                    color: 'white',
                  }}>
                  Delete
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default TaskListItem;
