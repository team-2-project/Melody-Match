var youtubeAPI = "AIzaSyCNYjluDnJK5CcflJ-sYsoRDzlUTNgLTo0";
var button = document.querySelector("#search-btn");
var mainVideo = document.querySelector("#main-video");
var similarVideos = document.querySelector("#similar-videos");
var h3Element = document.querySelector("#similar-videos h3");
var songInfo = document.querySelector("#song-info");
var songTitle = document.querySelector("#song-title");
var album = document.querySelector("#album-art");
var searchHx = document.querySelector("#search-history");
var input = document.querySelector("#song-input");
var allButtons = document.querySelectorAll("#search-history button");

var options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3bc0017a87msh1e4242be4f85c2cp173997jsnef2cc95fedfc",
    "X-RapidAPI-Host": "shazam.p.rapidapi.com",
  },
};

var clearAll = function () {
  while (mainVideo.childNodes.length > 0) {
    mainVideo.removeChild(mainVideo.lastChild);
  }

  while (similarVideos.childNodes.length > 2) {
    similarVideos.removeChild(similarVideos.lastChild);
  }

  album.src = "";
};

var saveHistory = function (songArtist) {
  localStorage.setItem("saveHistory", JSON.stringify(songArtist));
};

var buttonText = function () {
  return localStorage.getItem("saveHistory");
};

// Appends a clickable button with a search history that will search again for the text content of the button.
var historyButton = function () {
  var buttonContent = buttonText();
  var buttonEl = document.createElement("button");

  buttonEl.textContent = buttonContent;
  buttonEl.addEventListener("click", clearAll);
  buttonEl.addEventListener("click", fetchAPI2);
  document.getElementById("search-again").style.display = "block";
  searchHx.appendChild(buttonEl);
};

// This function calls upon the shazam api first to get the search results of the lyrics and then within the same scope, calls the youtube api and inserts the found song + artist to the youtube search for more accuracy
var fetchAPI = function () {
  var lyrics = input.value;
  console.log(lyrics);

  fetch(
    "https://shazam.p.rapidapi.com/search?term=" +
      lyrics +
      "&locale=en-US&offset=0&limit=5",
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      songTitle.textContent =
        "The best match for your search is " +
        response.tracks.hits[0].track.title +
        " by " +
        response.artists.hits[0].artist.name;

      album.src = response.artists.hits[0].artist.avatar;

      // Call the saveHistory function to save track and artist to localStorage
      saveHistory(
        response.tracks.hits[0].track.title +
          " by " +
          response.artists.hits[0].artist.name
      );
      
      historyButton();

      // Call the Youtube API fetch within the shazam API so we can use the shazam variables inside youtube API
      return fetch(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
          response.tracks.hits[0].track.title +
          response.artists.hits[0].artist.name +
          "&type=video&key=" +
          youtubeAPI
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          // loops through all the data items
          for (let i = 0; i < data.items.length; i++) {
            var youtubeLink =
              "https://www.youtube.com/embed/" + data.items[i].id.videoId;

            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", youtubeLink);

            // If it is the first (main) video in data, make it bigger and append it to a separate div from the rest
            if (i === 0) {
              mainVideo.appendChild(iframe);
              var mainVideoIframe = mainVideo.lastElementChild;

              mainVideoIframe.setAttribute("width", 560);
              mainVideoIframe.setAttribute("height", 330);
            } else {
              similarVideos.appendChild(iframe);
              h3Element.textContent = "Check out these other videos too!";
            }
          }
          input.value = '';
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// This function clears all the fields and then calls the fetchAPI function
var startFunction = function (e) {
  e.preventDefault();
  clearAll();
  fetchAPI();
};

// on button click, call the startFunction()
var clickSearch = function () {
  button.addEventListener("click", startFunction);
};

clickSearch();

// I just duplicated this function with the 'this' keyword cause I can't figure out how to consolidate it yet. !!!! TBD !!!!
var fetchAPI2 = function () {
  var lyrics = this.textContent;
  console.log(lyrics);

  fetch(
    "https://shazam.p.rapidapi.com/search?term=" +
      lyrics +
      "&locale=en-US&offset=0&limit=5",
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      songTitle.textContent =
        "The best match for your search is " +
        response.tracks.hits[0].track.title +
        " by " +
        response.artists.hits[0].artist.name;

      album.src = response.artists.hits[0].artist.avatar;

      // Call the saveHistory function to save track and artist to localStorage
      saveHistory(
        response.tracks.hits[0].track.title +
          " by " +
          response.artists.hits[0].artist.name
      );

      // Call the Youtube API fetch within the shazam API so we can use the shazam variables inside youtube API
      return fetch(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
          response.tracks.hits[0].track.title +
          response.artists.hits[0].artist.name +
          "&type=video&key=" +
          youtubeAPI
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          // loops through all the data items
          for (let i = 0; i < data.items.length; i++) {
            var youtubeLink =
              "https://www.youtube.com/embed/" + data.items[i].id.videoId;

            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", youtubeLink);

            // If it is the first (main) video in data, make it bigger and append it to a separate div from the rest
            if (i === 0) {
              mainVideo.appendChild(iframe);
              var mainVideoIframe = mainVideo.lastElementChild;

              mainVideoIframe.setAttribute("width", 560);
              mainVideoIframe.setAttribute("height", 330);
            } else {
              similarVideos.appendChild(iframe);
              h3Element.textContent = "Check out these other videos too!";
            }
          }
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
