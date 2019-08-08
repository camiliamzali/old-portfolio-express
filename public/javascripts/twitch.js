var clientSecret = require('dotenv');
$(document).ready(function () {

  // empty array for streamer names

  var streams = [];

  // URL for my followed channels

  var channelurl = 'https://api.twitch.tv/kraken/users/vesera/follows/channels?' + clientSecret + '&client_id=93eqbor77cm7cszclukq06n2qlimuy'

  // get function to pick 15 streamers from my followed channels and push streamer names into the empty streams array

  $.get(channelurl, function (data) {
    var arrayLength = data.follows.length;
    for (count = 0; count <= 15; count++) {
      var streamername = data.follows[count].channel.display_name;
      streams.push(streamername);
    }


    // loop to create url for each streamer's status and info

    streams.forEach(function (streamer, index) {
      var streamurl = 'https://api.twitch.tv/kraken/streams/' + streamer + '?' + clientSecret + '&client_id=93eqbor77cm7cszclukq06n2qlimuy';


      // pulling status and logo from current streaming channels

      $.get(streamurl, function (streaminfo) {
        var status = streaminfo.stream;
        var statustext = '';

        // if statment for online/offline channels

        if (status == null) {

          // If streamer is offline, stream reads as null and displays no info. Created new URL to redirect to URL that has logo and other info.

          var offlineurl = 'https://api.twitch.tv/kraken/channels/' + streamer + '?' + clientSecret + '&client_id=93eqbor77cm7cszclukq06n2qlimuy';


          // Get function to pull logo from channel page in case offline
          $.get(offlineurl, function (offlineinfo) {
            var offlinelogo = offlineinfo.logo;

            statustext = 'Offline';

            $('.streamer-box').append(`<div class="streamer-row offline" data-streamer="${streamer}"><div class="icon-box offline"><img class="logo offline" src="${offlinelogo}"></div><div class="main-box offline">${streamer} is offline.</div><div class="status-box  offline" style="color: #AC7FB5">${statustext}</div><div></div><div class="livestream hidden"><div class="twitch-box" id="${streamer}" data-id="${streamer}"></div></div>`);
          });
        } else {
          statustext = streaminfo.stream.game;
          var logo = streaminfo.stream.channel.logo;

          $('.streamer-box').append(`
                    <div class="streamer-row online" data-streamer="${streamer}">
                    <div class="icon-box online"><img class="logo online" src=" ${logo}"></div>
                    <div class="main-box  online">${streamer} is playing ${streaminfo.stream.game}.</div>
                    <div class="status-box  online" style="color:#F8FDD2">Online</div><div></div><div class="livestream hidden"><div class="twitch-box" id="${streamer}" data-id="${streamer}"></div></div><div></div>`);
        }
      });
    });
  });


  // functionality for tabbed box

  $('.search-bar .input-text').on('click', function () {
    $(this).parent().addClass('active-search');
  });
  $('.search-bar .input-text').focusout(function () {
    $(this).parent().removeClass('active-search');
  });

  $('button').on('click', function () {
    $('button').removeClass('active');
    $(this).addClass('active');
    var selectedTab = ($(this)[0].id);

    if (selectedTab == 'online') {
      $('.streamer-row.online').removeClass('hidden');
      $('.streamer-row.offline').addClass('hidden');

    }
    if (selectedTab == 'offline') {
      $('.streamer-row.online').addClass('hidden');
      $('.streamer-row.offline').removeClass('hidden');
    }
    if (selectedTab == 'all') {
      $('.streamer-row.online').removeClass('hidden');
      $('.streamer-row.offline').removeClass('hidden');
    }
  });
  $('#input').on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $('.streamer-row').addClass('hidden');
    var found = $(".streamer-row").toArray().filter(function (el) {
      return $(el).data('streamer').toLowerCase().includes(value);
    });
    found.forEach(function (el) {
      $(el).removeClass('hidden');
    });
  });
  $('.streamer-box').on('click', '.streamer-row.online', function () {
    var idName = $(this).children('.livestream').children('.twitch-box')[0].dataset.id;
    let options = {
      width: "100%",
      height: 480,
      channel: idName,
    };
    if ($(this).children('.livestream').hasClass('hidden')) {
      $('div.livestream').addClass('hidden');
      $(this).children('.livestream').removeClass('hidden');
      $('iframe').remove();
      let player = new Twitch.Player(idName, options);
    } else {
      $('iframe').remove();
      console.log('iframe removed');
      $(this).children('.livestream').addClass('hidden');
    };
  });
});
// nothing to see here x2
