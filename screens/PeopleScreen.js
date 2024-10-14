import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { FlatList, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FAB } from '@rneui/themed';
import PeopleContext from '../PeopleContext';
import { GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon, ListItem } from '@rneui/base';



export default function PeopleScreen() {
  const navigation = useNavigation();

  const { people, deletePerson } = useContext(PeopleContext);

  const renderItem = ({ item }) => (
    <ListItem.Swipeable
      onPress={() => navigation.navigate('Ideas', { id: item.id })}
      rightWidth={100}
      rightContent={() => (
        <TouchableOpacity onPress={() => deletePerson(item.id)} style={styles.deleteButton}>
          <Icon name='delete' size={32} color='white' />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.dob}</ListItem.Subtitle>
      </ListItem.Content>

      <Icon type='antdesign' name='gift' />
    </ListItem.Swipeable>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        {people.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyMsg}>Add a Person to get started</Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={people}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}

        <FAB
          size='small'
          title='Add Person'
          icon={{
            name: 'add',
            color: 'white',
          }}
          color=''
          style={styles.fab}
          onPress={() => navigation.navigate('AddPerson',)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 50,
    bottom: 40,
    marginVertical: 32,
    //TODO: Make closer to middle

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 4,
  },
});
