sp = getSpotifyApi(1);

exports.init = init;

function init() {

    updatePageWithTrackDetails();

    sp.trackPlayer.addEventListener("playerStateChanged", function (event) {

        // Only update the page if the track changed
        if (event.data.curtrack == true) {
            updatePageWithTrackDetails();
        }
    });
}

function updatePageWithTrackDetails() {

    var header = document.getElementById("header");

    // This will be null if nothing is playing.
    var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();

    if (playerTrackInfo == null) {
        header.innerText = "Nothing playing!";
    } else {
        var track = playerTrackInfo.track;
        header.innerText = track.name + " on the album " + track.album.name + " by " + track.album.artist.name + ".";
    }
}