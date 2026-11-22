// script.js

//https://www.w3schools.com/html/html_forms.asp
//https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_and_retrieving_form_data
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

// Array of song objects with album, artist, title, url, and album cover
const songs = [];
// example entry: { album: 'Wishbone', artist: 'Conan Gray', title: 'Actor', url: 'music/ConanGray- Wishbone(2025)/Actor.mp3', img: 'music/ConanGray-Wishbone(2025)/cover.jpg' }


// Get references to various constants
const albumCover = document.getElementById('albumCover');
const audioPlayer = document.getElementById('audioPlayer');
const playlist = document.getElementById('playlist');
const songTitle = document.getElementById('songTitle');
const songAlbum = document.getElementById('songAlbum');
const songArtist = document.getElementById('songArtist');

// Function to choose files and create playlist
function chooseFiles() {
    document.getElementById("file-picker").addEventListener("change", (event) => {
        let index = 0
        for (const file of event.target.files) {
            if (file.type === 'audio/mpeg') { // currently must be an mp3
                jsmediatags.read(file, {
                    onSuccess: function(tag) {
                        const tags = tag.tags;
                        const { data, format } = tags.picture;
                        let base64String = "";
                        for (let i = 0; i < data.length; i++) {
                            base64String += String.fromCharCode(data[i]);
                        }
                        const song = { album: tags.album, artist: tags.artist, title: tags.title, url: file.webkitRelativePath, img: `data:${data.format};base64,${window.btoa(base64String)}`};
                        songs.push(song)
                        // Create playlist items
                        let item = document.createElement("li");
                        item.textContent = song.title.concat(' (', song.album, ') by ', song.artist);
                        item.classList.add('playlist-item');
                        item.dataset.index = index; // Store song index in the dataset
                        playlist.appendChild(item);
                        index++;
                    },
                    onError: function(error) {
                        console.error("Error reading metadata:", error);
                        document.getElementById("title").textContent = "Error reading metadata";
                    }
                });
            }
        }
        console.log(songs);
    });
}

// Function to handle song selection
function selectSong(index) {
    const song = songs[index];
    // add song details and image
    albumCover.src = song.img;
    document.getElementById('songTitle').innerHTML = song.title;
    document.getElementById('songAlbum').innerHTML = song.album;
    document.getElementById('songArtist').innerHTML = song.artist;
    audioPlayer.src = song.url;
    audioPlayer.play();
    console.log(song.title);

    // Update the active class on playlist items
    document.querySelectorAll('.playlist-item').forEach((item) => {
        item.classList.remove('active');
    });
    document.querySelector(`.playlist-item[data-index="${index}"]`).classList.add('active');

    // Autoplay next song
    const nextsong = Number(index)+1;
    audioPlayer.addEventListener("ended", (event) => {
        console.log("Audio completed.");
        autoplayNextSong(nextsong);
    });
}

// Function to handle autoplay
function autoplayNextSong(index) {
    if (index == songs.length) {
        selectSong(0)
    } else {
        selectSong(index)
    }
}

// Event listener for playlist item clicks
playlist.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('playlist-item')) {
        const index = event.target.dataset.index;
        selectSong(index);
    }
});

// Search Function
function searchFunction() {
            let input = document.getElementById("song").value.toLowerCase();
            let items = document.querySelectorAll("#playlist li");
            items.forEach(item => {
                if (item.innerHTML.toLowerCase().includes(input)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        }

// Initialize playlist
chooseFiles();
