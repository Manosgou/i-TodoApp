import React from 'react';

import {TabView, SceneMap} from 'react-native-tab-view';
import DefaultPreference from 'react-native-default-preference';
import {View, TouchableOpacity, Animated} from 'react-native';
import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';

import CreateTaskView from './CreateTaskView';
import TasksListView from './TasksListView';

import {TodosContext} from '../context';

const renderScene = SceneMap({
  create: CreateTaskView,
  list: TasksListView,
});

// interface IState {
//   index: number;
//   routes: ;
//   todos: Array;
// }

class MainTabView extends React.Component {
  state = {
    index: 0,
    routes: [
      {key: 'create', title: 'Create task'},
      {key: 'list', title: 'Tasks list'},
    ],
    todos: [],
  };

  fetchTodos = async () => {
    return fetch('https://scmscore.i-magic.gr/uploads/rn/reminders')
      .then(res => res.json())
      .then(res => {
        this.setState({todos: res});
      })
      .catch(error => {
        console.error(error);
      });
  };
  createTask = async todo => {
    this.setState({todos: [...this.state.todos, todo]}, async () => {
      await DefaultPreference.set('@todos', JSON.stringify(this.state.todos));
    });
  };

  updateTask = async (
    taskId: String,
    title: String,
    date: String,
    hasReminder: boolean,
  ) => {
    let tasks = [...this.state.todos];
    const taskIndex = this.state.todos.findIndex(el => el.task_id === taskId);
    tasks[taskIndex].title = title;
    tasks[taskIndex].date = date;
    tasks[taskIndex].has_reminder = hasReminder;
    this.setState({todos: tasks}, async () => {
      await DefaultPreference.set('@todos', JSON.stringify(this.state.todos));
    });

    switch (hasReminder) {
      case true:
        const channelId = await notifee.createChannel({
          id: 'important',
          name: 'Important Notifications',
          importance: AndroidImportance.HIGH,
        });

        await notifee.requestPermission();

        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: new Date(date.toString()).getTime(),
        };
        await notifee.createTriggerNotification(
          {
            id: taskId.toString(),
            title: title.toString(),
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
            },
          },
          trigger,
        );
        break;
      case false:
        await notifee.cancelTriggerNotification(taskId.toString());
        break;
    }
  };

  deleteTask = async taskId => {
    const task = this.state.todos.filter(todo => todo.task_id != taskId);
    this.setState({todos: task}, async () => {
      await DefaultPreference.set('@todos', JSON.stringify(this.state.todos));
    });
  };
  async componentDidMount(): Promise<void> {
    await DefaultPreference.get('@todos').then(async value => {
      if (value) {
        const data = JSON.parse(value);
        this.setState({todos: data});
      } else {
        try {
          await this.fetchTodos();
          await DefaultPreference.set(
            '@todos',
            JSON.stringify(this.state.todos),
          );
        } catch (e) {}
      }
    });
  }

  _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 1 : 0.2,
            ),
          });

          return (
            <TouchableOpacity
              key={i}
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 16,
                backgroundColor: 'green',
              }}
              onPress={() => this.setState({index: i})}>
              <Animated.Text style={{opacity, color: 'white'}}>
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  render(): React.ReactNode {
    return (
      <TodosContext.Provider
        value={{
          todos: this.state.todos,
          createTask: this.createTask,
          deleteTask: this.deleteTask,
          updateTask: this.updateTask,
        }}>
        <TabView
          renderTabBar={this._renderTabBar}
          navigationState={this.state}
          renderScene={renderScene}
          onIndexChange={index => this.setState({index: index})}
        />
      </TodosContext.Provider>
    );
  }
}

export default MainTabView;
