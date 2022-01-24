import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TextInput, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [search, setsearch] = useState('');

  useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input todo');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  const searchFilter = (text) => {
    // if (text) {
    //   const newData = todos.filter((item) => {
    //     const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
    //     const textData = text.toUpperCase();
    //     return itemData.index0f(textData) > -1;
    //   });
    //   setTodos(newData);
    //   setsearch(text);
    // } else {
    //   setTodos(textInput);
    //   setsearch(text);
    // }
  }

  const ListItem = ({todo}) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={[styles.square, {backgroundColor: 'green'}]}>
            {!todo?.completed && (
              <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
                <Icon name="done" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: '#1f145c',
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.delete}>
            <Icon name="delete" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    )};

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
      <TextInput
        style={styles.textInputStyle}
        value={search}
        placeholder="Search Here"
        underlineColorAndroid="transparent"
        onChangeText={(text) => searchFilter(text)}
      />
        <Text style={styles.sectionTitle}>
          TODAY'S TASK
        </Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo"
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: '#fff',
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#1f145c',
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  tasksWrapper: {
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  delete: {
    // width: 16,
    // height: 16,
    // borderWidth: 5,
    // borderRadius: 5,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: 'Green',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '60%',
  },
  textInputStyle:{
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: 'white',
    borderRadius: 30,
  }
});

export default App;