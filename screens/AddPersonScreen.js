import React, { useContext, useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import PeopleContext from '../PeopleContext';
import background from '../assets/background-sprinkles.png';
import DatePicker from 'react-native-modern-datepicker';
import { Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import CustomDialog from '../components/Dialog';
import CustomBtn from '../components/Button';
import colors from '../assets/colors';

export default function AddPersonScreen() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const { savePerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const toggleDialog = () => setVisible(!visible);

  //save person, handle error messages or modal depending on err
  const handleSave = async () => {
    const result = await savePerson(name, dob);
    if (result.success) {
      navigation.goBack();
    } else {
      if (result.type === 'validation') {
        setErrMsg(result.message);
      } else if (result.type === 'operation') {
        setVisible(true);
      }
    }
  };

  return (
    <ImageBackground source={background} style={{ flex: 1, resizeMode: 'cover', backgroundColor: '#fff' }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputs}>
          <Input
            label='Name'
            inputStyle={{ backgroundColor: 'colors.surface', borderBottomWidth: 1 }}
            value={name}
            onChangeText={setName}
            errorMessage={errMsg}
          />

          <DatePicker
            style={{ borderRadius: 20 }}
            options={{
              backgroundColor: colors.surface,
              mainColor: colors.pink,
              selectedTextColor: 'black',
            }}
            mode='calendar'
            onSelectedChange={(date) => setDob(date)}
          />
        </KeyboardAvoidingView>

        <View style={styles.btns}>
          <CustomBtn title='Save' onPress={handleSave} color={colors.btnPrimary} />
          <CustomBtn title='Cancel' color={colors.btnSecondary} onPress={() => navigation.goBack()} />
        </View>

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
  btns: {
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
});
