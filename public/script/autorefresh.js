window.autorefresh = function() {
    console.log("Onload window")
    var itv 
    function getQueryParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var autoRefresh = parseInt(getQueryParameter('autoRefresh'), 10);

    if (isNaN(autoRefresh) || autoRefresh <= 0) {
        return;
    }

    // Function to update the countdown and refresh if necessary
    function updateCountdown() {
        if (autoRefresh > 0) {
            document.getElementById('countdown').innerText = autoRefresh;
            autoRefresh--; // decrement the counter
        } else {
            // Refresh the page when countdown reaches 0
            if (itv != null) {
                clearInterval(itv)
                itv = null
            }
            console.log("About to reload");
            window.location.reload();
        }
    }

    // Display initial countdown value and set interval
    itv = setInterval(updateCountdown, 1000); // update every second
};

window.autorefresh();