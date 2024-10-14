import React, { useContext, useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView, KeyboardAvoidingView, Text, Platform } from 'react-native';
import PeopleContext from '../PeopleContext';
import DatePicker from 'react-native-modern-datepicker';
import { Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { Dialog } from '@rneui/base';

export default function AddPersonScreen() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [errMsg,  setErrMsg] = useState('');
  const { addPerson } = useContext(PeopleContext);
  const navigation = useNavigation();
  
  const [visible, setVisible] = useState(false);
  const toggleDialog = () => setVisible(!visible);


  const savePerson = async () => {
    let validInputs = true;
    if (!name) {
      setErrMsg('Name is required');
      validInputs = false;
    }
    if (!dob) {
      setErrMsg('Date of Birth is required');
      validInputs = false;
    }
    if (validInputs) {
      const success = await addPerson(name, dob);
      if (success) {
        navigation.goBack();
      } else {
        //console.log('Error on the person screen saving');
        setVisible(true);
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.inputs}>

        <Input 
        label='Name' 
        value={name} 
        onChangeText={setName}
        errorMessage={errMsg}
        />

        <DatePicker
          style={styles.datePicker}
          mode='calendar'
          onSelectedChange={(date) => setDob(date)}
        />
      </KeyboardAvoidingView>

      <Button title='Save' onPress={savePerson} />
      <Button title='Cancel' onPress={() => navigation.goBack()} />

      <Dialog isVisible={visible} overlayStyle={styles.modal}>
        <Dialog.Title title='Something went wrong :('/>
        <Text>Unable to save this person</Text>
        <Dialog.Actions>
          <Button title='Close' onPress={toggleDialog}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputs: {
    flex: 1,
    paddingVertical: 24,
  },
  datePicker: {
    borderRadius: 20,
  },
  modal: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
