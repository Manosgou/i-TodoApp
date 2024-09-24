import React from 'react';
import {View, TextInput, Pressable, Text, Switch} from 'react-native';
import {TodosContext} from '../context';
import uuid from 'react-native-uuid';
import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';

interface IState {
  task_id: String;
  title: String;
  date: Date;
  has_reminder: boolean;
  datepickerIsVisible: boolean;
  titleError: boolean;
  dateError: boolean;
}
class CreateTaskView extends React.Component {
  state: IState = {
    task_id: '',
    title: '',
    date: new Date(),
    has_reminder: false,
    datepickerIsVisible: false,
    titleError: false,
    dateError: false,
  };
  static contextType = TodosContext;
  createTask = async () => {
    if (!this.state.title) {
      this.setState({titleError: true});
      return;
    }

    if (this.state.datepickerIsVisible && this.state.date <= new Date()) {
      this.setState({dateError: true});
      return;
    }
    const task = {
      task_id: uuid.v4(),
      title: this.state.title,
      date: this.state.datepickerIsVisible ? this.state.date : null,
      has_reminder: this.state.has_reminder,
    };
    if (task.has_reminder) {
      const channelId = await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
      });

      await notifee.requestPermission();

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: this.state.date.getTime(),
        alarmManager: {
          allowWhileIdle: true,
        },
      };

      await notifee.createTriggerNotification(
        {
          id: task.task_id.toString(),
          title: task.title,
          android: {
            channelId,
          },
        },
        trigger,
      );
    }
    this.context.createTask(task);
    Toast.show({
      type: 'success',
      text1: 'Task created!',
      position: 'top',
    });
    this.setState({
      task_id: '',
      title: '',
      date: new Date(),
      has_reminder: false,
      datepickerIsVisible: false,
      titleError: false,
      dateError: false,
    });
    notifee
      .getTriggerNotificationIds()
      .then(ids => console.log('All trigger notifications: ', ids));
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
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 30,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 20, margin: 20}}>
          Crete a task
        </Text>
        <TextInput
          placeholder="Add a title"
          value={this.state.title}
          onChangeText={value => this.handleInputChange('title', value)}
          maxLength={20}
          style={{
            borderColor: 'gray',
            width: '100%',
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        />
        {this.state.titleError ? (
          <Text style={{color: 'red'}}>Insert a valid title to the task</Text>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text>Date:</Text>
          <Switch
            onValueChange={() =>
              this.setState({
                datepickerIsVisible: !this.state.datepickerIsVisible,
              })
            }
            value={this.state.datepickerIsVisible}
          />
        </View>
        {this.state.datepickerIsVisible ? (
          <DatePicker
            date={this.state.date}
            onDateChange={date => {
              this.setState({date: date, has_reminder: true});
            }}
          />
        ) : null}
        {this.state.dateError ? (
          <Text style={{color: 'red'}}>
            Date must be grater than the current date
          </Text>
        ) : null}
        <Pressable
          onPress={() => this.createTask()}
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
            Save task
          </Text>
        </Pressable>
        <Toast />
      </View>
    );
  }
}

export default CreateTaskView;
