import React, { useContext, useState } from 'react';
import { View, Button, StyleSheet, KeyboardAvoidingView } from 'react-native';
import PeopleContext from '../PeopleContext';
import DatePicker from 'react-native-modern-datepicker';
import { Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function AddPersonScreen() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [errMsg,  setErrMsg] = useState('');
  const { addPerson } = useContext(PeopleContext); //getting this method from PeopleContext
  const navigation = useNavigation();

  const savePerson = () => {
    let validInputs = true;
    if (!name) {
      setErrMsg('Name is required');
      validInputs = false;
    }
    if (!dob) {
      setErrMsg('Date of Birth is required');
      validInputs = false;
    }
    else if (validInputs) {
      addPerson(name, dob);
      navigation.goBack();
    }
  };




  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
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
          //selected={dob}
        />
      </View>

      <Button title='Save' onPress={savePerson} />
      <Button title='Cancel' onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 20,
  },
  inputs: {
    paddingVertical: 24,
  },
  datePicker: {
    borderRadius: 20,
  },
});
