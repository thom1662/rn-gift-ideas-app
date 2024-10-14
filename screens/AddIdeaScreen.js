import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import PeopleContext from '../PeopleContext';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function AddIdeaScreen({ route }) {
    const navigation = useNavigation();
    const { id } = route.params;
    const { people } = useContext(PeopleContext);


    const person = people.find(p => p.id === id);

//textInput and Camera

  return (
    <SafeAreaView>
      <View>
        <Text>Add ideas for {person.name}</Text>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});