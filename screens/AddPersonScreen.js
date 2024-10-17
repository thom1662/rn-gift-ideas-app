import React, { useContext, useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  Platform,
  ImageBackground,
} from 'react-native';
import PeopleContext from '../PeopleContext';
import background from '../assets/background-sprinkles.png';
import DatePicker from 'react-native-modern-datepicker';
import { Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
//import { Dialog } from '@rneui/base';
import CustomDialog from '../components/Dialog';

export default function AddPersonScreen() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const { addPerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const toggleDialog = () => setVisible(!visible);

  const handleSave = async () => {
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
    <ImageBackground source={background} style={{ flex: 1, resizeMode: 'cover', backgroundColor: '#fff' }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputs}>
          <Input label='Name' value={name} onChangeText={setName} errorMessage={errMsg} />

          <DatePicker style={styles.datePicker} mode='calendar' onSelectedChange={(date) => setDob(date)} />
        </KeyboardAvoidingView>

        <Button title='Save' onPress={handleSave} />
        <Button title='Cancel' onPress={() => navigation.goBack()} />

        <CustomDialog
          visible={visible}
          title='Something went wrong'
          message='Unable to save this person'
          onClose={toggleDialog}
        />
      </SafeAreaView>
    </ImageBackground>
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
});
