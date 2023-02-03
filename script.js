var youtubeAPI = 'AIzaSyD7nJxKnVnhFHxNBUFHLydxK245aU2usOM';
var button = document.querySelector('#search-btn');
var mainVideo = document.querySelector('#main-video');
var similarVideos = document.querySelector('#similar-videos');
var h2Element = document.querySelector("#similar-videos h2");
var songInfo = document.querySelector("#song-info");
var songTitle = document.querySelector("#song-title")
var album = document.querySelector('#album-art');
var searchHx = document.querySelector('#search-history')
var input = document.querySelector('#song-input')
var allButtons = document.querySelectorAll("#search-history button");

var clearAll = function () {
    while (mainVideo.childNodes.length > 1) {
        mainVideo.removeChild(mainVideo.lastChild)
    }

    while (similarVideos.childNodes.length > 2) {
        similarVideos.removeChild(similarVideos.lastChild)
    }
    album.src = '';
}

var saveHistory = function (songArtist) {
  localStorage.setItem("saveHistory", JSON.stringify(songArtist));
}
var buttonText = function() {
  return localStorage.getItem("saveHistory");
}

// Appends a clickable button with a search history that will search again for the text content of the button. The only problem atm is when the button is clicked, it appends an additional element of the same text content !!!!! fix tbd
var historyButton = function () {
  var buttonContent = buttonText();
  var buttonEl = document.createElement("button");
  buttonEl.textContent = buttonContent;
  buttonEl.addEventListener("click", clearAll)
  buttonEl.addEventListener("click", fetchAPI2)
  searchHx.appendChild(buttonEl);
}

var fetchAPI = function() {

    var lyrics = input.value;
    console.log(lyrics);

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '09856b1bb4mshb15ad6ca0c0115dp1507ecjsn5721aa7158e7',
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
      }
    };
    
    fetch("https://shazam.p.rapidapi.com/search?term=" + lyrics + "&locale=en-US&offset=0&limit=5", options).then(response => response.json())
    .then(function(response) {
      
        
      songTitle.textContent = "The lyrics you searched for is " + response.tracks.hits[0].track.title + " by " + response.artists.hits[0].artist.name;
      
      album.src = response.artists.hits[0].artist.avatar;
      
      // Call the saveHistory function to save track and artist to localStorage
      saveHistory(response.tracks.hits[0].track.title + " by " + response.artists.hits[0].artist.name);
      historyButton();

      // Call the Youtube API fetch within the shazam API so we can use the shazam variables inside youtube API
      return fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + response.tracks.hits[0].track.title + response.artists.hits[0].artist.name + "&type=video&key=" + youtubeAPI)
      .then(response => response.json()).then(data => {
        console.log(data);

        // loops through all the data items
        for (let i = 0; i < data.items.length; i++) {
        var youtubeLink = "https://www.youtube.com/embed/" + data.items[i].id.videoId;

        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", youtubeLink);


        // If it is the first (main) video in data, make it bigger and append it to a separate div from the rest
        if (i === 0) {
          mainVideo.appendChild(iframe)
          var mainVideoIframe = mainVideo.lastElementChild;
          
          mainVideoIframe.setAttribute("width", 560);
          mainVideoIframe.setAttribute("height", 330);
        } else {
            similarVideos.appendChild(iframe);
          h2Element.textContent = "Check out these other videos too!"
        }
      
      }
      })
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

var clickSearch = function () {
  button.addEventListener("click", startFunction)
}

// Function to be used by the search button and any buttons created by history
var startFunction = function (e) {
  e.preventDefault();
  clearAll();
  fetchAPI();
}

clickSearch();


// I just duplicated this function with the 'this' keyword cause I can't figure out how to consolidate it yet
var fetchAPI2 = function() {
  
  var lyrics = this.textContent;
  console.log(lyrics);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '09856b1bb4mshb15ad6ca0c0115dp1507ecjsn5721aa7158e7',
      'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    }
  };
  
  fetch("https://shazam.p.rapidapi.com/search?term=" + lyrics + "&locale=en-US&offset=0&limit=5", options).then(response => response.json())
  .then(function(response) {
    
      
    songTitle.textContent = "The lyrics you searched for is " + response.tracks.hits[0].track.title + " by " + response.artists.hits[0].artist.name;
    
    album.src = response.artists.hits[0].artist.avatar;
    
    // Call the saveHistory function to save track and artist to localStorage
    saveHistory(response.tracks.hits[0].track.title + " by " + response.artists.hits[0].artist.name);
    historyButton();

    // Call the Youtube API fetch within the shazam API so we can use the shazam variables inside youtube API
    return fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + response.tracks.hits[0].track.title + response.artists.hits[0].artist.name + "&type=video&key=" + youtubeAPI)
    .then(response => response.json()).then(data => {
      console.log(data);

      // loops through all the data items
      for (let i = 0; i < data.items.length; i++) {
      var youtubeLink = "https://www.youtube.com/embed/" + data.items[i].id.videoId;

      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", youtubeLink);


      // If it is the first (main) video in data, make it bigger and append it to a separate div from the rest
      if (i === 0) {
        mainVideo.appendChild(iframe)
        var mainVideoIframe = mainVideo.lastElementChild;
        
        mainVideoIframe.setAttribute("width", 560);
        mainVideoIframe.setAttribute("height", 330);
      } else {
          similarVideos.appendChild(iframe);
        h2Element.textContent = "Check out these other videos too!"
      }
    
    }
    })
  })
  .catch(error => {
    console.error('Error:', error);
  });
}






//search for repeats in search history and delete so only appears once
//  !!!!! NOT WORKING !!!!
// var deleteDuplicate = function() {
//   var savedHistory = buttonText();
//   for (var i = 0; i < allButtons.length; i++) {
//     if (savedHistory === allButtons[i].textContent) {
//       allButtons[i].remove();

//     }
//   }
// }
