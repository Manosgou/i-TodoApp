import React from 'react';
import {FlatList, View, Text} from 'react-native';
import TaskListItem from '../components/TaskListItem';
import {TodosContext} from '../context';

class TasksListView extends React.Component {
  static contextType = TodosContext;

  render(): React.ReactNode {
    return (
      <View style={{flex: 1}}>
        {this.context.todos.length ? (
          <FlatList
            data={this.context.todos}
            keyExtractor={item => item.task_id}
            renderItem={({item}) => (
              <TaskListItem
                task_id={item.task_id}
                title={item.title}
                date={item.date}
                hasReminder={item.has_reminder}
              />
            )}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 30}}>
              There are no tasks :(
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default TasksListView;
