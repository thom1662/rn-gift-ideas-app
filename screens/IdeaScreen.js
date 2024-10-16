import { useContext, useEffect, useState } from 'react';
import { randomUUID } from 'expo-crypto';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import PeopleContext from '../PeopleContext';
import { useNavigation } from '@react-navigation/native';
import { FAB } from '@rneui/themed';
import { Icon, ListItem } from '@rneui/base';

export default function IdeaScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const { people, deleteIdea } = useContext(PeopleContext);

  const person = people.find(p => p.id === id);

  const [refresh, setRefresh] = useState(false); //remove
  

    const handleDelete = async (itemID) => {
      await deleteIdea(itemID, person.id);
      setRefresh(!refresh); //re-render
    }


console.log(person.ideas);

    const renderItem = ({ item }) => {
      const getImgSource = (img) => {
        if (typeof img === 'string') {
          return { uri: img };
        }
        return null;
    };
      
      return (
      <ListItem>
        <ListItem.Content style={styles.listContent}>
          <View>
            <ListItem.Title>{item.text}</ListItem.Title>
            <Image 
            source={getImgSource(item.img)} 
            style={styles.thumbnail} />
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon type='antdesign' name='delete' />
            <Text>Delete</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  }


  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Text>Gift ideas for {person.name}</Text>

        <View style={styles.container}>
          {person.ideas.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyMsg}>Add an idea to get started</Text>
            </View>
          ) : (
            <FlatList
              style={styles.list}
              data={person.ideas}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              extraData={refresh} //remove
            />
          )}

          <FAB
            size='small'
            title='Add Idea'
            icon={{
              name: 'add',
              color: 'white',
            }}
            color=''
            style={styles.fab}
            onPress={() => navigation.navigate('AddIdea', { id: person.id })}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginVertical: 10,
  },
  listContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnail: {
    width: 156,
    height: 234,
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