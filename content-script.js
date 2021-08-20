var displayHeights = function() {

    console.log("Displaying heights.");

    $("h3:contains('ASCENTS')").append("<div id='minHeight'>Shortest send height: Loading...</div>");

    var minHeight = null;
    var usernames = $("div.user-name:not(:has(.cell))");

    Promise.all(usernames.map( async(x) => {
        return new Promise((resolve, reject) => {
            var username = $(usernames[x]);
            if (username.attr("class").includes("auto")) {
                resolve();
                return;
            }
            var child = $(username.children()[0]);
            var href = child.attr("href");
            if (href === undefined || !href.includes("/sportclimbing")) {
                resolve();
                return;
            }
            href = href.replace("/sportclimbing", "");
            console.log("Getting height...")
            $.ajax({
                url: href,
                type: 'get',
                success: function(data, textStatus, jqXHR) {
                    if (textStatus !== "success") {
                        resolve();
                        return;
                    }
                    var idx = data.indexOf("Height:");
                    var substr = data.substring(idx, idx+200);
                    idx = substr.indexOf(">");
                    substr = substr.substring(idx+1);
                    idx = substr.indexOf("<");
                    substr = substr.substring(0, idx);
                    if (!substr.includes("cm")) {
                        resolve();
                        return;
                    }
                    child.append("<div>" + substr + "</div>");
                    idx = substr.indexOf(" ")
                    var height = parseInt(substr.substring(0, idx));
                    if (height !== NaN) {
                        if ((minHeight === null || height < minHeight)) {
                            minHeight = height;
                        }
                        var minHeightElement = $("#minHeight");
                        $(minHeightElement).text("Shortest send height: " + minHeight + "cm");
                    }
                    resolve();
                }
            });
        });
    }));
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    console.log("Request received.");
    console.log(request);
    if (request.message === 'getHeight') {
        setTimeout(displayHeights, 2000);
    }
});

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') {
    displayHeights();
  }
});
