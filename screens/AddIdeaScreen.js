import { useNavigation } from '@react-navigation/native';
import { useContext, useState, useEffect, useRef } from 'react';
import PeopleContext from '../PeopleContext';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Input, Button } from '@rneui/themed';

export default function AddIdeaScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const { people } = useContext(PeopleContext);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [itemText, setItemText] = useState('');

  const person = people.find((p) => p.id === id);

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera, please allow access in Settings</Text>;
  }


    const takePicture = async () => {
      if (cameraRef.current) {
        // Access the current value of cameraRef
        const data = await cameraRef.current.takePictureAsync();
        setPhoto(data.uri); // Set the photo URI to display
      }
    };



  return (
    <SafeAreaView style={styles.container}>
      <Text>Add ideas for {person.name}</Text>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Input label='Gift Idea' value={itemText} onChangeText={setItemText} />
      </KeyboardAvoidingView>

      <CameraView ref={cameraRef} style={{ flex: 1 }}>

        

      </CameraView>

      <Button title='Save' />
      <Button onPress={() => navigation.navigate('Ideas', { id: person.id })} title='Cancel' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
