import { useNavigation } from '@react-navigation/native';
import { useContext, useState, useEffect, useRef } from 'react';
import PeopleContext from '../PeopleContext';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Platform, Image } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Input, Button } from '@rneui/themed';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function AddIdeaScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const { people } = useContext(PeopleContext);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [itemText, setItemText] = useState('');
  const [imgSize, setImgSize] = useState(null); // State to save chosen size

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
      const availableSizes = await cameraRef.current.getAvailablePictureSizesAsync('2:3');
      console.log('Available Picture Sizes:', availableSizes);

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

      {!photo ? (
        <CameraView ref={cameraRef} style={styles.camera}>
          <TouchableOpacity onPress={takePicture} style={styles.camBtn}>
            <Icon name='camera' type='materialicons' size={75} color='white' />
          </TouchableOpacity>
        </CameraView>
      ) : (
        <View style={styles.camera}>
          <Image source={{ uri: photo }} style={{ flex: 1 }} />
        </View>
      )}

      <Button title='Save' />
      <Button onPress={() => navigation.navigate('Ideas', { id: person.id })} title='Cancel' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    margin: 24,
    padding: 10,
    justifyContent: 'flex-end',
  },
  camBtn: {
    alignSelf: 'center',
    backgroundColor: '#ffffff50',
    borderRadius: 50,
    padding: 4,
  },
});
