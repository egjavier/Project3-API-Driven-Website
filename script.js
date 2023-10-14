window.addEventListener('load', () => fetchApi())

function fetchApi() {
  const category = `Programming,Miscellaneous,Dark,Pun,Spooky,Christmas`
  const api = `https://v2.jokeapi.dev/joke/${category}`
  fetch ( 'https://v2.jokeapi.dev/joke/Any' )
    .then( response => response.json() )
    .then( data => {
      (data.joke !== undefined) ?
        console.log(data.joke) :
        console.log(
          `🤔: ${data.setup} \n 
          😂: ${data.delivery}`
        )
    } )
    .catch(error => console.log(error))
}

