sp = getSpotifyApi(1);

exports.init = init;
var m = sp.require("sp://import/scripts/api/models");
var v = sp.require("sp://import/scripts/api/views");

var chordify = {};
chordify.current_ajax_request = null;

function init() {

    chordify.updatePageWithTrackDetails();

    sp.trackPlayer.addEventListener("playerStateChanged", function (event) {

        // Only update the page if the track changed
        if (event.data.curtrack == true) {
            chordify.updatePageWithTrackDetails();
        }
    });
}

chordify.updatePageWithTrackDetails = function() {
    $('#content').html('');
    $('#pleasewait').show();
    var header = $("#header");
    var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();

    if (!playerTrackInfo) {
        //header.text("Nothing playing!");
        //chordify.fetch_top_songs();
        $('#pleasewait').hide();
    } else {
        var track = playerTrackInfo.track;
        chordify.get_chords(track.album.artist.name, track.name);
    }
};

chordify.fetch_top_songs = function() {
    var songs = {}; 
    $.ajax({
         type: 'post',
         dataType: 'json',
         url: "http://mattandrews.info/spotify/top.php",
         success: function(response){
            for(var i in response) {
                var song = response[i];
                if(song) {
                    console.log('fetching song');
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        data: 'title=' + escape(song.title) + '&artist=' + escape(song.artist), 
                        url: "http://mattandrews.info/spotify/song.php",
                        success: function(response){
                            console.log("got song");
                            songs[i] = response;
                        }
                    });
                }                

            }
            while(songs.length <= response.length) {
                chordify.build_playlist(songs);
            }
         }
    });
    
    
};

chordify.get_spotify_track = function(artist, title) {
    $.ajax({
         type: 'post',
         dataType: 'json',
         data: 'title=' + escape(title) + '&artist=' + escape(artist), 
         url: "http://mattandrews.info/spotify/song.php",
         success: function(response){
            console.log("got", response);
            return response;
         }
    });
    
};

chordify.build_playlist = function(songs) {
    console.log(songs);
    /*
    var tpl = new m.Playlist();
    var tplPlayer = new v.Player();
    var tempList = new v.List(tpl);
        
    if(typeof(songs[0].tracks !== "undefined")) {
        
        for(s in songs[0].tracks) {
        
            var song = songs[0].tracks[s];
            var link = song.href;
            if(link) {
                tpl.add(m.Track.fromURI(link));
            }
        }
    }
    
    tplPlayer.track = tpl.get(0);
    tplPlayer.context = tpl;
    tempList.node.classList.add("temporary");
    document.body.appendChild(tplPlayer.node);
    document.body.appendChild(tempList.node);
    */
};

chordify.get_chords = function(artist, title) {
    $('#header').html('<h2>' + artist + '</h2><h3>' + title + '</h3>');
    $('#loader').show();
    
    // need to cancel previous requests
    if(chordify.current_ajax_request) {
        chordify.current_ajax_request.abort();
    }
    //$("html,body").animate({ scrollTop: 0}, 0 );
    chordify.current_ajax_request = $.ajax({
         type: 'post',
         url: "http://mattandrews.info/spotify/data.php",
         data: 'artist=' + escape(artist) + '&title=' + escape(title),
         success: function(response){
            $('#loader').hide();
            $('#pleasewait').hide();
            $('#content').html(response);
            var destination = $('#footer').offset().top;
            //$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination-20}, 70000 );
         }
    });
};