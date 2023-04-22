//Settings - Change these to your liking
var apiKey = "YOUR_API_KEY";// Replace YOUR_API_KEY with your actual API key
var channelId = "UCoMdktPbSTixAyNGwb-UYkQ";//SKY NEWS - Replace with any channel ID
var limit = 9;//Changes the amount of videos shown

// Get the current livestream
var livestreamUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&channelId=" + channelId + "&key=" + apiKey;
fetch(livestreamUrl)
    .then(response => response.json())
    .then(data => {
        var aspectRatio = 9 / 16; // 16:9 aspect ratio
        var width = "100%"; // Set the width to 100%
        // Calculate the height based on the aspect ratio and width
        var height = Math.round(parseInt(width) * aspectRatio);
        if (data.items.length > 0) {
            // Display the current livestream
            var livestreamId = data.items[0].id.videoId;
            document.getElementById("livestream").innerHTML = "<div style='position:relative; width:" + width + "; height:0; padding-bottom:" + height + "%;'><iframe style='position:absolute; width:100%; height:100%; left: 0;' src='https://www.youtube.com/embed/" + livestreamId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe></div>";
        } else {
            document.getElementById("livestream").innerHTML = "<img src='holder.js/1920x1080?text=LIVESTREAM%20OFFLINE&bg=#333&fg=#fff' alt='Offline'>";
            Holder.run({images: document.querySelectorAll("#livestream img")});
        }
    }).catch(error => {
    document.getElementById("livestream-title").innerHTML = "<h1>Error loading livestream!</h1>";
});

// Get the 3 latest videos
var videosUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channelId + "&maxResults=" + limit + "&order=date&type=video&key=" + apiKey;
fetch(videosUrl)
    .then(response => response.json())
    .then(data => {
        // Display the 3 latest videos
        var videosHtml = "";
        var channelTitle = data.items[0].snippet.channelTitle;
        data.items.forEach(function (item) {
            var videoId = item.id.videoId;
            var videoTitle = item.snippet.title;
            var videoPublishedAt = item.snippet.publishedAt;
            var videoThumbnail = item.snippet.thumbnails.high.url;
            var videoHtml = "<div class=\"col-md-4\">";
            videoHtml += "<div class=\"card mb-4 box-shadow\">";
            videoHtml += "<a href='https://www.youtube.com/watch?v=" + videoId + "'>";
            videoHtml += "<img class=\"card-img-top\" src=' " + videoThumbnail + "' alt=\"" + videoTitle + "\" style=\"height: 225px; width: 100%; display: block;\">";
            videoHtml += "</a>";
            videoHtml += "<div class=\"card-body bg-light\">";
            videoHtml += "<p class=\"card-text\">";
            videoHtml += "<a href='https://www.youtube.com/watch?v=" + videoId + "'>" + videoTitle + "</a>";
            videoHtml += "</p>";
            videoHtml += "<div class=\"d-flex justify-content-between align-items-center\">";
            videoHtml += "<div class=\"btn-group\">";
            videoHtml += "<a href='https://www.youtube.com/watch?v=" + videoId + "' class=\"btn btn-sm btn-outline-secondary\">View</a>";
            videoHtml += "</div>";
            videoHtml += "<small class=\"text-muted\">" + formatPublishedDate(videoPublishedAt) + "</small>";
            videoHtml += "</div>";
            videoHtml += "</div>";
            videoHtml += "</div>";
            videoHtml += "</div>";
            videosHtml += videoHtml;
        });
        document.getElementById("videos").innerHTML = videosHtml;
        document.getElementById("livestream-title").innerHTML = channelTitle + " Livestream";
    }).catch(error => {
    document.getElementById("videos").innerHTML = "<h1>Error loading videos!</h1>";
});

function toggleDarkMode() {
    const html = document.querySelector('html');
    const theme = html.getAttribute('data-bs-theme');
    if (theme === 'dark') {
        html.setAttribute('data-bs-theme', 'light');
    } else {
        html.setAttribute('data-bs-theme', 'dark');
    }
}

function formatPublishedDate(publishedAt) {
    // Parse the publishedAt string into a Date object
    var publishedDate = new Date(publishedAt);

    // Calculate the time difference between the published date and the current date
    var currentDate = new Date();
    var timeDiff = Math.abs(currentDate.getTime() - publishedDate.getTime());
    var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    var diffHours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    var diffMinutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));

    // Return the time difference as a human-readable string
    if (diffDays > 0) {
        return diffDays + " days ago";
    } else if (diffHours > 0) {
        return diffHours + " hours ago";
    } else {
        return diffMinutes + " minutes ago";
    }
}