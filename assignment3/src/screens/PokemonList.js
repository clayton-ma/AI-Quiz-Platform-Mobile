import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, ListItem, SearchBar } from "react-native-elements";

import pokeballIcon from "../assets/pokeball.png";
import MainHeader from "../components/ui/MainHeader";
import PokemonType from "../components/PokemonType";
import { FullPokemonsAPI } from "../../constants";

export default function PokemonList({ navigation }) {
  const [displayPokemons, setDisplayPokemons] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const renderItem = ({ item, index }) => {
    const pokemonTypes = item.field_pokemon_type.split(", ");
    const PokemonTypeElement = pokemonTypes.map((type, index) => {
      return (
        <View key={index}>
          <PokemonType type={type} />
        </View>
      );
    });

    return (
      <ListItem
        bottomDivider={true}
        onPress={() => {
          navigation.navigate("PokemonDetail", {
            pokemon: displayPokemons[index],
          });
        }}
      >
        <Avatar
          source={item.uri ? { uri: item.uri } : pokeballIcon}
          size="medium"
        />

        <ListItem.Content>
          <ListItem.Title>{item.title_1}</ListItem.Title>

          <ListItem.Subtitle style={styles.listItemSubtitle}>
            #
            {item.number.length <= 3
              ? ("00" + item.number).slice(-3)
              : item.number}
          </ListItem.Subtitle>
        </ListItem.Content>

        <View style={{ flexDirection: "row" }}>{PokemonTypeElement}</View>
      </ListItem>
    );
  };

  const searchPokemon = useCallback(
    debounce((keyword) => {
      if (keyword === "") {
        setDisplayPokemons(pokemons);
      } else {
        const filteredPokemons = pokemons.filter((pokemon) => {
          return pokemon.title_1.toLowerCase().includes(keyword.toLowerCase());
        });
        setDisplayPokemons(filteredPokemons);
      }
    }, 1000),
    [pokemons],
  );

  const inputSearchPokemon = (keyword) => {
    setKeyword(keyword);
    searchPokemon(keyword);
  };

  useEffect(() => {
    const fetchData = async (url) => {
      try {
        // Hardcoded pokemon data to replace response json
        const responseJson = [
          {
            nid: "1",
            title_1: "Bulbasaur",
            number: "1",
            field_pokemon_type: "Grass, Poison",
            uri: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
            sta: "128",
            atk: "118",
            def: "111",
            cp: "1115",
            field_pokemon_generation: "Generation 1",
            catch_rate: "20%",
            field_flee_rate: "10%",
          },
        ];

        setPokemons(responseJson);
        setDisplayPokemons(responseJson);
        setKeyword("");
        setLoading(false);
      } catch (error) {
        // Alert.alert("Cannot connect to Server!");
      }
    };

    fetchData(FullPokemonsAPI);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MainHeader title="Pokemons" isMain={true} navigation={navigation} />

      <SearchBar
        placeholder="Find Pokemon by name ..."
        inputContainerStyle={{ backgroundColor: "#e9e9e9" }}
        containerStyle={{ backgroundColor: "transparent" }}
        lightTheme={true}
        round={true}
        value={keyword}
        onChangeText={inputSearchPokemon}
      />

      {!isLoading ? (
        <FlatList
          data={displayPokemons}
          renderItem={renderItem}
          keyExtractor={(item) => item.nid}
          initialNumToRender={10}
        />
      ) : (
        <ActivityIndicator animating size="large" style={{ marginTop: 20 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listItemSubtitle: { marginTop: 10, color: "#939393" },
});
