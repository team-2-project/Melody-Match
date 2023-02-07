var youtubeAPI = "AIzaSyD7nJxKnVnhFHxNBUFHLydxK245aU2usOM";

var geniusToken = "TKNKtVG41FCOucKBEivHvEvMWkmKRnnv6xsNE3q2osdeTPu3-8KpkfLIcMZ0vScy"

var button = document.querySelector("#search-btn");
var mainVideo = document.querySelector("#main-video");
var similarVideos = document.querySelector("#similar-videos");
var h3Element = document.querySelector("#sim-vid-container h3");
var songInfo = document.querySelector("#song-info");
var songTitle = document.querySelector("#song-title");
var album = document.querySelector("#album-art");
var searchHx = document.querySelector("#search-history");
var input = document.querySelector("#song-input");
var allButtons = document.querySelectorAll("#search-history button");

var modal = document.querySelector(".modal");
var modalError = document.querySelector(".modal-error")

var modalCloseBlank = document.querySelector(".modal .modal-box button");
var modalCloseError = document.querySelector("#modal-error-btn");

var lyricsHREF = document.querySelector("#lyrics");

var options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3bc0017a87msh1e4242be4f85c2cp173997jsnef2cc95fedfc",
    "X-RapidAPI-Host": "shazam.p.rapidapi.com",
  },
};

var clearAll = function () {
  console.log("In clear all");
  while (mainVideo.childNodes.length > 0) {
    mainVideo.removeChild(mainVideo.lastChild);
  }

  while (similarVideos.childNodes.length > 0) {
    similarVideos.removeChild(similarVideos.lastChild);
  }

  album.src = "";
};

var saveHistory = function (songArtist) {
  localStorage.setItem("saveHistory", songArtist);
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
  buttonEl.addEventListener("click", fetchAPIHISTORY);
  document.getElementById("search-again").style.display = "block";
  searchHx.appendChild(buttonEl);
};

// Modal for when user input is BLANK
var modalPopup = function () {
  modal.classList.add("modal-active");

  modalCloseBlank.addEventListener("click", function () {
      modal.classList.remove("modal-active");
  });
};

// Modal for when user input is INVALID
var modalErrorPopup = function () {
  modalError.classList.add("modal-active-error")

    modalCloseError.addEventListener("click", function () {
      modalError.classList.remove("modal-active-error");
  });
}

// This function calls upon the shazam api first to get the search results of the lyrics and then within the same scope, calls the youtube api and inserts the found song + artist to the youtube search for more accuracy
var fetchAPI = function () {
  var lyrics = input.value;

  // If input is blank, modal pop up
  if (lyrics === "") {
    modalPopup();
    return;
  }

  fetch(
    "https://shazam.p.rapidapi.com/search?term=" +
      lyrics +
      "&locale=en-US&offset=0&limit=5",
    options
  )
  .then(response => {
    return response.json();
  })
    .then(function (response) {
      console.log(response);
      
      // If unable to find any tracks, modal pop up
      if (response.tracks === undefined) {
        modalErrorPopup();
        return;
      }

      // Had to move the clearAll function here after the modalErrorpopup function or else it would call the clearall regardless. When placed here, and modalerror function activates, the clearAll function will not.
       clearAll();


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

      // Calling Genius API within the Shazam fetch so we can use the Shazam results as parameters to Genius API
      fetch("https://api.genius.com/search?q=" + response.artists.hits[0].artist.name + response.tracks.hits[0].track.title + "&access_token=" + geniusToken)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        lyricsHREF.setAttribute("href", data.response.hits[0].result.url)
      })
      .catch(error => {
          console.error(error);
      });
      
      // Also calling Youtube API within shazam fetch
      fetch(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
          response.tracks.hits[0].track.title +
          response.artists.hits[0].artist.name +
          "&type=video&key=" +
          youtubeAPI
      )
        .then((response) =>  response.json())
        .then((data) => {
          console.log(data);
  
          var mainYoutubeLink = "https://www.youtube.com/embed/" + data.items[0].id.videoId;
          var iframe = document.createElement("iframe");
          iframe.setAttribute("src", mainYoutubeLink);
          mainVideo.appendChild(iframe);

          var mainVideoIframe = mainVideo.lastElementChild;
          mainVideoIframe.setAttribute("width", "100%");
          mainVideoIframe.setAttribute("height", "100%");
            
          // Clears the input field
          input.value = '';
        })

        // Start i = 1 because i = 0 would be the same as main video
      for (let i = 1; i < response.tracks.hits.length; i++) {
        fetch(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
            response.tracks.hits[i].track.title +
            response.artists.hits[i].artist.name +
            "&type=video&key=" +
            youtubeAPI
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
       
            var iframe = document.createElement("iframe");
            var suggestedYoutubeLinks = 'https://www.youtube.com/embed/' + data.items[i].id.videoId
            iframe.setAttribute("src",  suggestedYoutubeLinks);
            similarVideos.appendChild(iframe);
            h3Element.textContent = "Check out these other videos too!";
            input.value = '';
          })
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    })
};

// This function clears all the fields and then calls the fetchAPI function
var startFunction = function (e) {
  e.preventDefault();
  fetchAPI();
};

// on button click, call the startFunction()
var clickSearch = function () {
  button.addEventListener("click", startFunction);
};

clickSearch();

// I just duplicated this function with the 'this' keyword cause I can't figure out how to consolidate it yet. !!!! TBD !!!!
var fetchAPIHISTORY = function () {
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
        "The lyrics you searched for is " +
        response.tracks.hits[0].track.title +
        " by " +
        response.artists.hits[0].artist.name;

      album.src = response.artists.hits[0].artist.avatar;


      fetch("https://api.genius.com/search?q=" + response.artists.hits[0].artist.name + response.tracks.hits[0].track.title + "&access_token=" + geniusToken)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        lyricsHREF.setAttribute("href", data.response.hits[0].result.url)
      })
      .catch(error => {
        console.error(error);
      });

      // Call the Youtube API fetch within the shazam API so we can use the shazam variables inside youtube API
      return fetch(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
          response.tracks.hits[0].track.title + response.artists.hits[0].artist.name + "&type=video&key=" + youtubeAPI
      ).then((response) => response.json())
        .then((data) => {

          for (let i = 0; i < data.items.length; i++) {
            var youtubeLink =
              "https://www.youtube.com/embed/" + data.items[i].id.videoId;

            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", youtubeLink);

            // If it is the first (main) video in data, make it bigger and append it to a separate div from the rest
            if (i === 0) {
              mainVideo.appendChild(iframe);
              var mainVideoIframe = mainVideo.lastElementChild;

              mainVideoIframe.setAttribute("width", "100%");
              mainVideoIframe.setAttribute("height", "100%");
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
