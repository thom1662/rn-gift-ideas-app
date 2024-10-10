import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Button, FlatList, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FAB } from '@rneui/themed';
import PeopleContext from '../PeopleContext';
import { GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '@rneui/base';

export default function PeopleScreen() {
  const navigation = useNavigation();

  const { people, deletePerson } = useContext(PeopleContext);

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.listItem}>
        <Text>{item.name}</Text>
        <Text>{item.dob}</Text>
      </View>
    </Swipeable>
  );

  const renderRightActions = (id) => (
    <TouchableOpacity onPress={() => deletePerson(id)} style={styles.deleteButton}>
      <Icon name='delete' size={32} color='white' />
      <Text style={styles.deleteText}>
        Delete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.list}
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />

        <FAB
          size='small'
          title='Add Person'
          icon={{
            name: 'add',
            color: 'white',
          }}
          color=''
          style={styles.fab}
          onPress={() => navigation.navigate('AddPerson')}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
  listItem: {
    padding: 20,
    backgroundColor: 'pink',
    //borderRadius: 15,
  },
  list: {
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: 'white',
    fontWeight: "bold",
  },
  fab: {
    // position: 'absolute',
    // right: 50,
    // bottom: 100,
    marginVertical: 32,
    //will need to make absolute later in case of long list

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
});
