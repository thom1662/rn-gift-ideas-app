import { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, ImageBackground, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PeopleContext from '../PeopleContext';
import background from '../assets/background-sprinkles.png';
import { useNavigation } from '@react-navigation/native';
import { FAB } from '@rneui/themed';
import { Icon, ListItem } from '@rneui/base';
import colors from '../assets/colors';

export default function IdeaScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const { people, deleteIdea } = useContext(PeopleContext);

  const person = people.find((p) => p.id === id);

  const [refresh, setRefresh] = useState(false);

  const handleDelete = async (itemID) => {
    await deleteIdea(itemID, person.id);
    setRefresh(!refresh); //re-render
  };


  const renderItem = ({ item }) => {
    const getImgSource = (img) => {
      if (typeof img === 'string') {
        return { uri: img };
      }
      return null;
    };

    return (
      <ListItem style={{flex: 1}} containerStyle={styles.listItem}>
        <ListItem.Content>
          <View>
            <ListItem.Title style={{ fontWeight: '600', fontSize: '18'}}>{item.text}</ListItem.Title>
            <Image source={getImgSource(item.img)} style={styles.thumbnail} />
            <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <Icon type='antdesign' name='delete' size={28} color={'#fff'} />
              <Text style={{ color: '#fff', paddingTop: 6, fontWeight: '500' }}>Delete</Text>
            </Pressable>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <ImageBackground source={background} style={{ flex: 1, resizeMode: 'cover', backgroundColor: '#fff' }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Text style={styles.headline}>Gift ideas for {person.name}</Text>

          <View style={{ flex: 1 }}>
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
                numColumns={2}
              />
            )}

            <FAB
              size='medium'
              color={colors.btnPrimary}
              title='Add Idea'
              titleStyle={{ color: 'white', fontWeight: '600' }}
              icon={{
                name: 'add',
                size: 28,
                color: 'white',
              }}
              style={styles.fab}
              onPress={() => navigation.navigate('AddIdea', { id: person.id })}
            />
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 24,
    fontWeight: '600',
    margin: 16,
    alignSelf: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMsg: {
    fontSize: 18,
    backgroundColor: 'white',
    padding: 10,
  },
  list: {
    marginVertical: 8,
  },
  listItem: {
    alignSelf: 'flex-start',
    flexShrink: 1,
    backgroundColor: 'transparent',

  },
  thumbnail: {
    width: 165,
    height: 247.5,
    borderRadius: 10,
    marginVertical: 6,
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8, 
    borderRadius: 16,
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
