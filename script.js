var youtubeAPI = 'AIzaSyD7nJxKnVnhFHxNBUFHLydxK245aU2usOM';
var button = document.querySelector('#search-btn');
var mainVideo = document.querySelector('#main-video')
var similarVideos = document.querySelector('#similar-videos');
var h2Element = document.querySelector("#similar-videos h2");
var songInfo = document.querySelector("#song-info");
var album = document.querySelector('#album-art')


var clearAll = function () {
    while (mainVideo.childNodes.length > 2) {
        mainVideo.removeChild(mainVideo.lastChild)
    }

    while (similarVideos.childNodes.length > 2) {
        similarVideos.removeChild(similarVideos.lastChild)
    }

    album.src = '';
}

button.addEventListener("click", function (e) {
    e.preventDefault();
    clearAll();

    var input = document.querySelector('#song-input')
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
      
        var songName = document.createElement("h2");
      songName.textContent = "The lyrics you searched for is " + response.tracks.hits[0].track.title + " by " + response.artists.hits[0].artist.name;
        songInfo.appendChild(songName);
    
      
      album.src = response.artists.hits[0].artist.avatar;
      songInfo.appendChild(album);


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
  
})

