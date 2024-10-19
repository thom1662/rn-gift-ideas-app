import { useNavigation } from '@react-navigation/native';
import { useContext, useState, useEffect, useRef } from 'react';
import PeopleContext from '../PeopleContext';
import background from '../assets/background-sprinkles.png';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Input } from '@rneui/themed';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomDialog from '../components/Dialog';
import CustomBtn from '../components/Button';

export default function AddIdeaScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const cameraRef = useRef(null);
  const { people, saveIdea } = useContext(PeopleContext);

  const [photo, setPhoto] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [itemText, setItemText] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [visible, setVisible] = useState(false);

  const toggleDialog = () => setVisible(!visible);

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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No access to camera, please allow access in Settings</Text>
      </View>
    );
  }

  //set the photo state, erase error message
  const takePicture = async () => {
    if (cameraRef.current) {
      const availableSizes = await cameraRef.current.getAvailablePictureSizesAsync();

      const options = {
        quality: 0.8,
        pictureSize: availableSizes ? availableSizes[1] : '1200x1800',
        imageType: 'jpg',
        skipProcessing: false,
      };
      //controlling image that the camera takes, will change size upon save in context
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data.uri); // Set the photo URI to display
      setErrMsg('');
    }
  };

  //save the idea to the person's list, validate the inputs in context
  const handleSave = async () => {
    const result = await saveIdea(person.id, itemText, photo);
    if (result.success) {
      navigation.navigate('Ideas', { id: person.id });
    } else {
      if (result.type === 'validation') {
        setErrMsg(result.message); // Show validation error message
      } else if (result.type === 'operation') {
        setVisible(true); // Show modal for save operation error
      }
    }
  };

  return (
    <ImageBackground source={background} style={{ flex: 1, resizeMode: 'cover', backgroundColor: '#fff' }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.headline}>Add an idea for {person.name}</Text>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Input
            label='Idea Name'
            value={itemText}
            onChangeText={(text) => {
              setItemText(text);
              setErrMsg('');
            }}
            errorMessage={errMsg}
            errorStyle={{ fontSize: 16 }}
          />
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
        <CustomBtn onPress={handleSave} title='Save' />
        <CustomBtn onPress={() => navigation.navigate('Ideas', { id: person.id })} title='Cancel' outlined={true} />

        <CustomDialog
          visible={visible}
          title='Something went wrong'
          message='Unable to save this idea'
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
  headline: {
    fontSize: 24,
    fontWeight: '600',
    margin: 16,
    alignSelf: 'center',
  },
  camera: {
    flex: 1,
    margin: 16,
    padding: 10,
    justifyContent: 'flex-end',
    borderRadius: 8,
  },
  camBtn: {
    alignSelf: 'center',
    backgroundColor: '#ffffff50',
    borderRadius: 50,
    padding: 4,
  },
});
