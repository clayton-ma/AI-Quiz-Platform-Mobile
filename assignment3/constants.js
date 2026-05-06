const FullPokemonsAPI =
  "https://gamepress.gg/sites/default/files/aggregatedjson/pokemon-data-full-en-PoGO.json";
const FullMovesAPI =
  "https://gamepress.gg/sites/default/files/aggregatedjson/move-data-full-PoGO.json";

const PokemonTypeIcon = {
  bug: require("./src/assets/type-bug.png"),
  dark: require("./src/assets/type-dark.png"),
  dragon: require("./src/assets/type-dragon.png"),
  electric: require("./src/assets/type-electric.png"),
  fairy: require("./src/assets/type-fairy.png"),
  fighting: require("./src/assets/type-fighting.png"),
  fire: require("./src/assets/type-fire.png"),
  flying: require("./src/assets/type-flying.png"),
  ghost: require("./src/assets/type-ghost.png"),
  grass: require("./src/assets/type-grass.png"),
  ground: require("./src/assets/type-ground.png"),
  ice: require("./src/assets/type-ice.png"),
  normal: require("./src/assets/type-normal.png"),
  poison: require("./src/assets/type-poison.png"),
  psychic: require("./src/assets/type-psychic.png"),
  rock: require("./src/assets/type-rock.png"),
  steel: require("./src/assets/type-steel.png"),
  water: require("./src/assets/type-water.png"),
  default: require("./src/assets/type-ice.png"),
};

const BackgroundColor = "#559EDF";

export { FullPokemonsAPI, FullMovesAPI, PokemonTypeIcon, BackgroundColor };
