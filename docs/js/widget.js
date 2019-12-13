var WeMatcherWidget = function (id) {
    var div = document.getElementById(id);
    if (!div) {
        return;
    }

    $('#' + id).html('<iframe id="wematcher_frame" allow="camera; microphone" src="https://applet.wematcher.com" frameborder="0" width="1200" height="560" style="border-radius: 4px;"></iframe>');

    // window.onmessage = function(e) {
    //     if(e.data.type && e.data.type == 'size') {
    //         $('#wematcher_frame').height(e.data.value.height);
    //         $('#wematcher_frame').width(e.data.value.width);
    //     }
    // }
}

