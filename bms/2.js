// Initialize namespace
var BMS = BMS ? BMS : {};
BMS.Constants = {
    TRAILER_PREVIEW: "https://in.bmscdn.com/events/moviecard/{0}.jpg",
    YT_EMBED_URL: "https://www.youtube.com/embed/",
    YT_VIDEO: `<div class="preview-pane embed-responsive embed-responsive-16by9">
    <iframe class="embed-responsive-item" src="{src}" allowfullscreen></iframe>
</div>`,
    TILE: `<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 d-block mb-4 h-100 video-thumbnail" data-id="{id}">
    <img src="{src}" alt="{alt}" class="img-fluid img-thumbnail">
    <div class="overlay">
        <div class="release-date">
            {releaseDate}
        </div>
        <div class="rating">
            <div>
                👍 {percent}%
            </div>
            <div>
                {votes} votes
            </div>
        </div>
        <img class="play-icon mx-auto d-block" src="play-icon.png" alt="Play {alt}">

    </div>
    <div class="text-info">{name}</div>
</div>`,
};
BMS.languages = [];
BMS.events = {};

// Load data
BMS.loadData = function () {
    $.ajax({
        url: "./data.json",
        success: function (response) {
            BMS.languages = response[0];
            BMS.events = response[1];
            BMS.loadRefiners();
            BMS.loadTiles();
        },
        error: function (error) {
            console.warn(error);
            BMS.loadTiles();
        }
    });
};

// load refiners data
BMS.loadRefiners = function () {
    // languages
    $.each(BMS.languages, function (key, value) {
        $(`<option value=${value.toLowerCase()}>`).text(value).appendTo("#languages");
    });
    $("#languages").multiselect({
        maxHeight: 300,
        buttonClass: "btn btn-outline-dark"
    });
    $("#languages").change(function () {
        BMS.loadTiles();
    });

    // genres
    let genres = [];
    $.each(BMS.events, function (key, value) {
        let genre = value.EventGenre.split("|");
        $.each(genre, function (key, value) {
            genres.push($.trim(value));
        });
    });
    $.each(genres, function (key, value) {
        if (!$(`#genres option[value='${value.toLowerCase()}']`).length) {
            $(`<option value=${value.toLowerCase()}>`).text(value).appendTo("#genres");
        }
    });
    $("#genres").multiselect({
        maxHeight: 300,
        buttonClass: "btn btn-outline-dark"
    });
    $("#genres").change(function () {
        BMS.loadTiles();
    });
};

// load video preview
BMS.loadPreview = function (key) {
    let event = BMS.events[key];
    if (event) {
        let videoID = BMS.getParams(event.TrailerURL)["v"];
        // show preview
        $(".preview-pane").remove();
        let preview = BMS.Constants.YT_VIDEO;
        preview = preview.split("{src}").join(BMS.Constants.YT_EMBED_URL + videoID);
        $(preview).insertBefore(`div[data-id='${key}']`);
        $('html, body').animate({
            scrollTop: $(".preview-pane").offset().top
        }, 500);
    }
};

// load data on screen
BMS.loadTiles = function () {
    // filter content
    let data = {};
    let filterLanguages = [], filterGenres = [];
    // get filters
    $("#languages :selected").each(function () {
        filterLanguages.push($(this).val());
    });
    $("#genres :selected").each(function () {
        filterGenres.push($(this).val());
    });
    if (filterLanguages.length || filterGenres.length) {
        // filters applied
        let filteredData = {};
        $.each(BMS.events, function (key, value) {
            if (filterLanguages.length && filterGenres.length) {
                // both filters applied
                let genres = value.EventGenre.split("|");
                $.each(genres, function (index, genre) {
                    if (-1 !== $.inArray(genre.toLowerCase(), filterGenres) && (-1 !== $.inArray(value.EventLanguage.toLowerCase(), filterLanguages))) {
                        filteredData[key] = value;
                        return false;
                    }
                });
            } else if (filterGenres.length) {
                // only genre applied
                let genres = value.EventGenre.split("|");
                $.each(genres, function (index, genre) {
                    if (-1 !== $.inArray(genre.toLowerCase(), filterGenres)) {
                        filteredData[key] = value;
                        return false;
                    }
                });
            } else if (filterLanguages.length) {
                // only language applied
                if (-1 !== $.inArray(value.EventLanguage.toLowerCase(), filterLanguages)) {
                    filteredData[key] = value;
                }
            }
        });
        data = filteredData;
    } else {
        // no filters applied
        data = BMS.events;
    }

    // render content
    $("#thumbnails").empty();
    if (Object.keys(data).length) {
        $("#error-notification").addClass("hidden");
        $.each(data, function (key, value) {
            let trailerImage = BMS.Constants.TRAILER_PREVIEW.split("{0}").join(key);
            let name = value.EventName;
            let likePerc = value.wtsPerc;
            let likeCount = value.wtsCount;
            let showDate = value.ShowDate;

            let tile = BMS.Constants.TILE;
            tile = tile.split("{src}").join(trailerImage);
            tile = tile.split("{alt}").join(name);
            tile = tile.split("{name}").join(name);
            tile = tile.split("{id}").join(key);
            tile = tile.split("{releaseDate}").join(showDate);
            tile = tile.split("{percent}").join(likePerc);
            tile = tile.split("{votes}").join(likeCount);


            $("#thumbnails").append(tile);
        });
        // bind events
        $(".video-thumbnail").on("click", function () {
            BMS.loadPreview($(this).data("id"));
        });
    } else {
        $("#error-notification").removeClass("hidden");
    }
};

// get url parameter
BMS.getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

$(document).ready(function () {
    BMS.loadData();
});