import React, { useState, useEffect } from 'react';
import { Button, View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from './services/supabase';
import { getLocationAddress } from './MapAPI'
import { formatDate } from './DateFormat';
import { RandomHeartRate, RandomTimestamp } from './RandomGenerator';

export default function Details() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const [task, setTask] = useState(null);
  const [location, setLocation] = useState<string>();
  const [date, setDate] = useState<string>()

  const fetchLocation = async () => {
    const address = await getLocationAddress(task.coord_x, task.coord_y);
    setLocation(address);
  };

  const fetchDate = async () => {
    const timestamp = formatDate(task.timestamp);
    setDate(timestamp);
  };

  const fetchTask = async () => {
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();
    if (error) {
      console.error(error);
    } else {
      setTask(data);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const deleteTask = async (id: number) => {
    console.log('Tentando excluir tarefa com ID:', id); // Verifique o valor do id aqui
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();
  
    if (error) {
      console.error("Erro ao verificar a existência da tarefa", error);
      return;
    }

    if (data) {
      console.log('Tarefa encontrada:', data);
      const { error: deleteError } = await supabase.from("tasks").delete().match({ id });

      if (deleteError) {
        console.error("Erro ao excluir a tarefa", deleteError);
      } else {
        setTask(null);
        navigation.goBack();
      }
    } else {
      console.error("Tarefa não encontrada para exclusão.");
    }
  };

  const updateTask = async (id:number, avg_heartrate:number, max_heartrate:number, min_heartrate:number, timestamp:string,) => {
    const {error} = await supabase.from("tasks").update({ avg_heartrate, max_heartrate, min_heartrate, timestamp }).match({ id });
    
    if (error) {
      console.error(error);
    } else {
      fetchTask();
    }
  }

  

  useEffect(() => {
    if (task) {
      fetchLocation()
      fetchDate();
    }
  }, [task])
  return (
    <SafeAreaView style={styles.container}>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      {task ? (
        <View style={styles.task} key={task.id}>
          <Text style={styles.textTask}>Pertencente: {task.name}</Text>
          <Text style={styles.textTask}>ID do dispositivo: {task.device_id}</Text>
          <Text style={styles.textTask}>Última atualização: {date}</Text>
          <Text style={styles.textTask}>Média de batimento cardíaco: {task.avg_heartrate}bpm</Text>
          <Text style={styles.textTask}>Maior batimento cardíaco: {task.max_heartrate}bpm</Text>
          <Text style={styles.textTask}>Menor batimento cardíaco: {task.min_heartrate}bpm</Text>
          <Text style={styles.textTask}>{location}</Text>
          <View style={styles.viewButton}>
            <TouchableOpacity 
            style={styles.button} 
            onPress={() => updateTask(task.id, ~~RandomHeartRate().avg, RandomHeartRate().max, RandomHeartRate().min, new Date().toLocaleString())}>
              <Text>Atualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.button} 
            onPress={() => deleteTask(task.id)}>
              <Text>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text>Carregando...</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  task: {
    padding: 10,
    backgroundColor: 'lightgray',
    marginTop: 10,
    borderRadius: 5,
  },
  textTask: {
    fontSize: 18,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});
