var pokemonCount = 151; 
var pokeDexContainer = document.getElementById('pokeDexContainer'); 
var favoritesContainer = document.getElementById('favoritesContainer'); 
var favSection = document.getElementById('favoriteSection'); 
var sort = document.querySelector('#sortContainer');
var sortFav = document.querySelector('#sortFav');
var favoritesModal = document.querySelector('.favorites-modal');
var pokeIndex = {};
const color = {
  Normal :  'rgba(168, 167, 122, .7)',
  Fire : 'rgba(255, 17, 17, .7)',
  Water : 'rgba(17, 17, 255, .7)',
  Electric : 'rgba(255, 215, 51, .7)',
  Grass : 'rgba(122, 199, 76, .7)',
  Ice : 'rgba(150, 217, 214, .7)',
  Fighting : 'rgba(194, 46, 40, .7)',
  Poison : 'rgba(163, 62, 161, .7)',
  Ground : 'rgba(226, 191, 101, .7)',
  Flying : 'rgba(169, 143, 243, .7)',
  Psychic : 'rgba(249, 85, 135, .7)',
  Bug : 'rgba(166, 185, 26, .7)',
  Rock : 'rgba(182, 161, 54, .7)',
  Ghost : 'rgba(115, 87, 151, .7)',
  Dragon : 'rgba(111, 53, 252, .7)',
  Dark : 'rgba(112, 87, 70, .7)',
  Steel : 'rgba(183, 183, 206, .7)',
  Fairy : 'rgba(214, 133, 173, .7)',
}

function getPokemon(count){
  let pokemon = fetch('https://pokeapi.co/api/v2/pokemon/'+ count.toString());
  let pokemonSpecies = fetch('https://pokeapi.co/api/v2/pokemon-species/' + count.toString()); 

  Promise.all([pokemon, pokemonSpecies])
         .then((response) => {
          return Promise.all(response.map((res) => res.json()));
         })
         .then((data) => {
          const[pokemon, species] = data; 

          var name = pokemon.name[0].toUpperCase()+pokemon.name.slice(1); 
          var order = pokemon.id.toString().padStart(3,0); 
          var height = toFeet(pokemon.height); 
          var weight = (pokemon.weight/4.536).toFixed(2); 
          var types = Capitalize(pokemon.types.map (element => element.type.name));
          var ability = Capitalize(pokemon.abilities.map(element => element.ability.name)); 
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${count}.png`; 
          const pokeDesc = species.flavor_text_entries[9].flavor_text;
          var [hp, atk, def, spAtk, spDef, spd] = pokemon.stats; 

          pokeIndex [count]= {'name': name, 'image': image, 'order': order, 'height': height, 'weight': weight, 'types': types, 'ability': ability, 'description': pokeDesc,'stats': pokemon.stats, 'hp': hp.base_stat, 'atk': atk.base_stat, 'def': def.base_stat, 'spAtk': spAtk.base_stat, 'spDef': spDef.base_stat, 'spd': spd.base_stat };

          //Card container
          const attributes = {
            'data-name': pokeIndex[count].name,
            'data-order': pokeIndex[count].order,
            'data-type1': pokeIndex[count].types[0],
            'data-type2': pokeIndex[count].types[1],  
          }; 
          let pokemonCardContainer = document.createElement('div');
          pokemonCardContainer.classList.add('pokemon-card-container');
          pokeDexContainer.appendChild(pokemonCardContainer);

          setAttributes(pokemonCardContainer, attributes);


          //Front of the cards
          let cardInner = document.createElement('div');
          cardInner.classList.add('card-inner');
          pokemonCardContainer.appendChild(cardInner)

          let cardFront = document.createElement('div');
          cardFront.classList.add('card-front');
          cardInner.appendChild(cardFront);

          let imageBackground = document.createElement('div'); 
          imageBackground.classList.add('image-Bg');
          imageBackground.style.backgroundImage = `linear-gradient(to bottom, ${color[pokeIndex[count].types[0]]}, white)`;
          cardFront.appendChild(imageBackground);

          let imageWrapper = document.createElement('div');
          imageWrapper.classList.add('image-wrapper'); 
          imageWrapper.innerHTML = `
            <img src = ${image} alt = ${name} image> 
          `
          imageBackground.appendChild(imageWrapper);

          let pokemonNameWrapper = document.createElement('div');
          pokemonNameWrapper.classList.add('pokemon-name-wrapper'); 
          pokemonNameWrapper.innerHTML = `
            <p id = 'order'> #${order}</p>
            <p id = 'name'> ${name}</p>
          `
          cardFront.appendChild(pokemonNameWrapper);

          let pokeTypesWrapper = document.createElement('div'); 
          pokeTypesWrapper.classList.add('type-wrapper');
          pokeIndex[count].types.forEach(function (type) {
            let typeItem = document.createElement('p');
            typeItem.classList.add('types'); 
            typeItem.textContent = type; 
            typeItem.style.backgroundColor = color[type];
            pokeTypesWrapper.appendChild(typeItem);
          });
          cardFront.appendChild(pokeTypesWrapper);

          let pokeBuild = document.createElement('div'); 
          pokeBuild.classList.add('build-container'); 
          pokeBuild.innerHTML = `
            <p id = 'height'> ht: ${height} </p>
              <hr> 
            <p id = 'weight'> wt: ${weight} lbs</p> 
          `
          cardFront.appendChild(pokeBuild);

          //Backside of the cards. 
          let cardBack = document.createElement('div'); 
          cardBack.classList.add('card-back');
          cardBack.setAttribute('id', 'cardBack');
          cardInner.appendChild(cardBack);

          let cbHeader = document.createElement('div');
          cbHeader.classList.add('cb-header');
          cbHeader.innerHTML = `
          <div class="add">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="remove">
            <i class="fa-solid fa-xmark"></i>
          </div>
          `
          cardBack.appendChild(cbHeader);

          let pokemonDesc = document.createElement('div')
          pokemonDesc.setAttribute('id', 'pokemonDescription');
          pokemonDesc.innerHTML = `
            <p id = description>${pokeIndex[count].description}</p>
          `
          cardBack.appendChild(pokemonDesc);

          var statsWrapper = document.createElement('div'); 
          statsWrapper.setAttribute('id', 'statsWrapper');
          statsWrapper.innerHTML = `
          <p id='statsHeader'>Base Stats</p>
          <div class='progress-wrapper'>
            <label for='hp'>HP:</label>
            <progress class='progress' id='hp' value='${pokeIndex[count].hp}' max='200'></progress>
          </div>
          <div class='progress-wrapper'>
            <label for='attack'>Attack:</label>
            <progress class='progress' id='attack' value='${pokeIndex[count].atk}' max='200'></progress>
          </div>
          <div class='progress-wrapper'>
            <label for='defense'>Defense: </label>
            <progress class='progress' id='defense' value='${pokeIndex[count].def}' max='200'></progress>
          </div>
          <div class='progress-wrapper'>
            <label for='spAtk' >Sp-Atk:</label>
            <progress class='progress' id='spAtk' value='${pokeIndex[count].spAtk}' max='200'></progress>
          </div>
          <div class='progress-wrapper'>
            <label for='spDef'>Sp-Def:</label>
            <progress class='progress' id='spDef' value='${pokeIndex[count].spDef}' max='200'></progress>
          </div>
          <div class='progress-wrapper'>
            <label for='speed'>Speed:</label>
            <progress class='progress' id='speed' value='${pokeIndex[count].spd}' max='200'></progress>
          </div>
          `
          cardBack.appendChild(statsWrapper);

          let abilities = document.createElement('div');
          abilities.setAttribute('id', 'abilities');
          abilities.innerHTML = `
          <p id = 'ability'>Ability: ${pokeIndex[count].ability[0]}</p>
          `
          cardBack.appendChild(abilities);

      //Adding to favorites page
      for (let i = 0; i < document.querySelectorAll('.add').length; i++){
        document.querySelectorAll('.add')[i].addEventListener('click', function(){
          let favoritesContainer = document.getElementById('favoritesContainer')
          let card = this.parentNode.parentNode.parentNode.parentNode
          card.classList.remove('pokemon-card-container')
          card.classList.add('favorite')
          this.classList.add('active')
          this.parentNode.childNodes[3].classList.add('active')
          favoritesContainer.appendChild(card);
        })
      }

      //removing from favorites page
      for (let i = 0; i < document.querySelectorAll('.remove').length; i++){
        document.querySelectorAll('.remove')[i].addEventListener('click', function(){
          let favCard = this.parentNode.parentNode.parentNode.parentNode
          favCard.classList.add('pokemon-card-container')
          favCard.classList.remove('favorite')
          this.classList.remove('active')
          this.parentNode.childNodes[1].classList.remove('active');
          pokeDexContainer.appendChild(favCard);
        })
      } 
        
      //Search bar
      var pokemonCard = '.card-front';
      var cards = document.querySelectorAll(pokemonCard);
  
      const searchBox = document.querySelector('#search');

      searchBox.addEventListener('keyup', (e) => {
      const searchInput = e.target.value.toUpperCase().trim();

      cards.forEach((card) => {
        if(card.textContent.toUpperCase().includes(searchInput)){
          card.parentNode.parentNode.style.display = 'block'
        }else{
          card.parentNode.parentNode.style.display = 'none'
        }
      })  
      })

      //Sort 
      function sortUp(data, cardList, container,){
        let sortArray = []; 
        for(let i = 0; i < cardList.length; i++){
          sortArray.push(cardList[i]); 
        }
        console.log(sortArray); 

        let sortedCards = sortArray.sort(function(a,b) {
          if(a.getAttribute(data) < b.getAttribute(data)){
            return -1; 
          }else{
            return 1; 
          }
        });
        sortedCards.forEach((card) => {
          container.appendChild(card); 
        }); 
      }

      function sortDown(data, cardList, container) {
        let sortArray = []; 
        for(let i = 0; i < cardList.length; i++){
          sortArray.push(cardList[i]); 
        }
        console.log(sortArray);

        let sortedCards = sortArray.sort(function(a,b) {
          if(a.getAttribute(data) > b.getAttribute(data)){
            return -1; 
          }else{
            return 1; 
          }
        }); 
        sortedCards.forEach((card) => {
          container.appendChild(card);
        });
      }
      
      sort.addEventListener('change', function() {
        let field = this.value; 
        let pokemonCards = document.querySelectorAll('.pokemon-card-container'); 
        if(field === 'idUp'){
          sortUp('data-order', pokemonCards, pokeDexContainer);
          console.log(field); 
        }else if(field === 'idDwn'){
          sortDown('data-order', pokemonCards, pokeDexContainer);
          console.log(field);
        }else if(field === 'alphaUp'){
          console.log(field);
          sortUp('data-name', pokemonCards, pokeDexContainer)
        }else if(field === 'alphaDown'){
          sortDown('data-name', pokemonCards, pokeDexContainer); 
          console.log(field);
        }
      })

      sortFav.addEventListener('change', function() {
        let field = this.value; 
        let favoriteCards = document.querySelectorAll('.favorite'); 
        if(field === 'favIdUp'){
          sortUp('data-order', favoriteCards, favoritesContainer);
          console.log(field);
        }else if(field === 'favIdDwn'){
          sortDown('data-order', favoriteCards, favoritesContainer);
          console.log(field);
        }else if(field === 'favAlphaUp'){
          sortUp('data-name', favoriteCards, favoritesContainer);
          console.log(field);
        }else if(field === 'favAlphaDwn'){
          sortDown('data-name', favoriteCards, favoritesContainer)
          console.log(field);
        }
      })

  });
}
    

//Nav buttons
fav.addEventListener('click', function() {
  favoritesModal.classList.add('is-visible');
})

var modalClose = document.querySelector('.modal-close');
modalClose.addEventListener('click', function() {
  favoritesModal.classList.remove('is-visible');
})

home.addEventListener('click', function(){
  window.location.reload();
});

//When loading window
window.onload = function() {
  pokeDexContainer.classList.add('initial')
  for(let count = 1; count <= pokemonCount; count++){
    getPokemon(count);
  }
}


//conversion functions
function Capitalize(pokemonArray){
  return pokemonArray.map(element => {
    return element.charAt(0).toUpperCase()+element.substring(1).toLowerCase()
  })
}

function toFeet(height){
  let inches = (height * 3.937).toFixed(0); 
  let feet = Math.floor(inches/12); 
  inches %= 12; 
  return (`${feet}' ${inches}"`); 
}

function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(attr => {
    element.setAttribute(attr, attributes[attr]);
  }); 
}

function removeAttributes(element,attributes) {
  attributes.forEach(attr => {
    element.removeAttribute(attr); 
  });
}
