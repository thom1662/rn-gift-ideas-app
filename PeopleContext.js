import React, { createContext, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';

const PeopleContext = createContext();

//provide the people list from context obj
export const PeopleProvider = ({ children }) => {
  //context is accessible by all child elements (this wraps all the pages in navigator)
  const [people, setPeople] = useState([]);

  const STORAGE_KEY = 'people'; //name of the list

  // Load people from AsyncStorage
  useEffect(() => {
    const loadPeople = async () => {
      const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPeople) {
        const parsed = JSON.parse(savedPeople);
        const sortedPeople = sortDobs(parsed);
        setPeople(sortedPeople);
      }
    };
    loadPeople();
    console.log(people);
  }, []);

  const savePerson = async (name, dob) => {
    try {
      if (!name || name.trim() === '') {
        return { success: false, type: 'validation', message: 'Name is required' };
      }
      if (!dob) {
        return {
          success: false,
          type: 'validation',
          message: 'Birthday required, use date picker to select',
        };
      }

      //error simulation
      //throw new Error('cant do it');

      const newPerson = {
        id: randomUUID(),
        name,
        dob,
        ideas: [],
      };
      const updatedPeople = [...people, newPerson];

      const sortedPeople = sortDobs(updatedPeople);
      console.log(sortedPeople);
      setPeople(sortedPeople);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
      return {success: true};
    } catch (error) {
      return { success: false, type: 'operation', message: error.message };
    }
  };

  const deletePerson = async (id) => {
    //console.log(`delete this id: ${id}`);
    const updatedPeople = people.filter((person) => person.id !== id);
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const deleteIdea = async (itemID, personID) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personID) {
        return { ...person, ideas: person.ideas.filter((idea) => idea.id !== itemID) };
      }
      return person;
    });
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const sortDobs = (list) => {
    return list.sort((a, b) => {
      const [yearA, monthA, dayA] = a.dob.split('/').map(Number);
      const [yearB, monthB, dayB] = b.dob.split('/').map(Number);
      if (monthA === monthB) {
        //if months are same, compare days
        return dayA - dayB;
      } else {
        return monthA - monthB;
      }
    });
  };

  const calculateImgDimensions = (screenWidthPercent) => {
    const screenWidth = Dimensions.get('window').width;
    const imageWidth = screenWidth * screenWidthPercent;
    const aspectRatio = 2 / 3;
    const imageHeight = imageWidth * aspectRatio;
    return { imageWidth, imageHeight };
  };

  const saveIdea = async (personID, text, img) => {
    try {
      if (!text || text.trim() === '') {
        return { success: false, type: 'validation', message: 'Idea name is required' };
      }
      if (!img) {
        return {
          success: false,
          type: 'validation',
          message: 'Photo required, press shutter button to take a picture',
        };
      }
      //error simulation
      // throw new Error('cant do it');

      const updatedPeople = people.map((person) => {
        if (person.id === personID) {
          const newIdea = {
            id: randomUUID(),
            text,
            img,
            ...calculateImgDimensions(0.7),
          };
          return { ...person, ideas: [...person.ideas, newIdea] };
        }
        return person;
      });
      setPeople(updatedPeople);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
      return { success: true };
    } catch (error) {
      return { success: false, type: 'operation', message: error.message };
    }
  };

  return (
    <PeopleContext.Provider value={{ people, savePerson, deletePerson, deleteIdea, saveIdea }}>
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;
