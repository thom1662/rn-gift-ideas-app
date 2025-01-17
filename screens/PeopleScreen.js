import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { FlatList, View, Text, SafeAreaView, StyleSheet, ImageBackground } from 'react-native';
import background from '../assets/background-sprinkles.png';
import { FAB } from '@rneui/themed';
import PeopleContext from '../PeopleContext';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon, ListItem } from '@rneui/base';
import colors from '../assets/colors';

export default function PeopleScreen() {
  const navigation = useNavigation();

  const { people, deletePerson } = useContext(PeopleContext);

  const formatDate = (dobString) => {
    const date = new Date(dobString.replace(/\//g, '-')); // Ensure the date string is in the correct format, no slashes
    let options = { month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-CA', options).format(date);
  };

  const renderItem = ({ item }) => (
    <ListItem.Swipeable
      containerStyle={styles.listItem}
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
        <ListItem.Title style={{fontWeight: '500'}}>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{formatDate(item.dob)}</ListItem.Subtitle>
      </ListItem.Content>

      <Icon type='antdesign' name='gift' size={32} />
    </ListItem.Swipeable>
  );

  return (
    <ImageBackground source={background} style={{ flex: 1, resizeMode: 'cover', backgroundColor: '#fff' }}>
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
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />
          )}

          <FAB
            size='medium'
            color={colors.btnPrimary}
            title='Add Person'
            titleStyle={{ color: 'white', fontWeight: '600' }}
            icon={{
              name: 'add',
              size: 28,
              color: 'white',
            }}
            style={styles.fab}
            onPress={() => navigation.navigate('AddPerson')}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </ImageBackground>
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
  listItem: {
    backgroundColor: colors.surface,
    padding: 20,
  },
  deleteButton: {
    backgroundColor: colors.btnSecondary,
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

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 4,
  },
});
