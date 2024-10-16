import React, { createContext, useState, useEffect } from "react";
import { Dimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

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

  const addPerson = async (name, dob) => {
    try {
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
      //console.log(sortedPeople);
      setPeople(sortedPeople);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
      return true;
    } catch (error) {
      //console.log("error saving person:", error);
      return false;
    }
  };



  const deletePerson = async (id) => {
    //console.log(`delete this id: ${id}`);
    const updatedPeople = people.filter((person) => person.id !== id);
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };



  const deleteIdea = async (itemID, personID) => {
    const updatedPeople = people.map((person) =>{
      if(person.id === personID) {
        return {...person, ideas: person.ideas.filter((idea) => idea.id !== itemID)};
      }
      return person;
    });
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  }



  const sortDobs = (list) => {
    return list.sort((a, b) => {
      const [yearA, monthA, dayA] = a.dob.split('/').map(Number);
      const [yearB, monthB, dayB] = b.dob.split('/').map(Number);
      if (monthA === monthB) { //if months are same, compare days
        return dayA - dayB;
      } else {
        return monthA - monthB;
      }
    })
  }


  const calculateImgDimensions = (screenWidthPercent) => {
    const screenWidth = Dimensions.get('window').width;
    const imageWidth = screenWidth * screenWidthPercent;
    const aspectRatio = 2 / 3;
    const imageHeight = imageWidth * aspectRatio;
    return { imageWidth, imageHeight };
  };


  const saveIdea = async (personID, text, img) => {
    try{
      const updatedPeople = people.map((person) => {
        if (person.id === personID) {
          const newIdea = {
            id: randomUUID(),
            text,
            img,
            ...calculateImgDimensions(0.6)
          };
          return { ...person, ideas: [...person.ideas, newIdea] };
        }
        console.log(person);
        return person;
      });
      setPeople(updatedPeople);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
      return true;
    } catch (error) {
      console.log("error saving idea:", error);
      return false;
  };
}


  return <PeopleContext.Provider value={{ people, addPerson, deletePerson, deleteIdea, saveIdea }}>{children}</PeopleContext.Provider>;
};

export default PeopleContext;
