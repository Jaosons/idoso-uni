import React, { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, TouchableWithoutFeedback} from 'react-native';
import { supabase } from './services/supabase';
import { RandomHeartRate, RandomLocation, RandomTimestamp } from './RandomGenerator';

export default function Home() {
  const [newTask, setNewTask] = useState("");
  const [newId, setNewId] = useState<number>();
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const fetchTasks = async () => {
    const {data, error} = await supabase.from("tasks").select("*");

    if(error){
      console.error(error);
    } else {
      setTasks(data);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
        fetchTasks()
    }, [])
  )
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (name:string, device_id:number, timestamp:Date, avg_heartrate:number, max_heartrate:number, min_heartrate:number, coord_x:number, coord_y:number) => {
    const { error } = await supabase.from("tasks").insert({name, device_id, timestamp, avg_heartrate, max_heartrate, min_heartrate, coord_x, coord_y})
    if (error) {
      console.error(error)
    } else { 
      await fetchTasks();
    }
  }

  const updateTask = async (id:number, completed:boolean) => {
    const {error} = await supabase.from("tasks").update({ completed }).match({ id });
    
    if (error) {
      console.error(error);
    } else {
      await fetchTasks();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title='Adicionar novo dispositivo' onPress={() => setModalVisible(true)}/>
      <Modal 
        animationType='slide' 
        transparent={true} 
        visible={modalVisible} 
        onRequestClose={() => { 
        setModalVisible(!modalVisible) 
        }}>
        <TouchableWithoutFeedback onPress={ () => { setModalVisible(!modalVisible) }}>
            <View style={styles.centeredView}>
                <TouchableWithoutFeedback onPress={ () => {}}>
                    <View style={styles.modalView}>
                        <Text style={styles.title}>Adicione um novo dispositivo</Text>
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} placeholder='Digite o ID do dispositivo' onChangeText={(id) => setNewId(Number(id))} value={newId} keyboardType='numeric'/>
                            <TextInput style={styles.input} placeholder='Digite o nome do pertencente' onChangeText={(text) => setNewTask(text)} value={newTask}/>
                            <TouchableOpacity style={styles.button} onPress={() => handleAddTask(newTask, Number(newId), new Date(RandomTimestamp()), ~~RandomHeartRate().avg, RandomHeartRate().max, RandomHeartRate().min, RandomLocation().x, RandomLocation().y)}>
                                <Text style={styles.buttonText}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            
        </TouchableWithoutFeedback>
      </Modal>
      <ScrollView>
        {tasks.map((task) => (
          <View style={styles.devices} key={task.id}>
            <Text style={styles.name}>{task.name}</Text>
            <Button title='Detalhes' onPress={() => navigation.navigate('Details', {id: task.id})}/>
          </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
      },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
      button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
      },
      name: {
        fontSize:20,
      },
      devices: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
      
    
});
