VM = {
    messages: {
        list: ko.observableArray([]),
        unreadCount: ko.observable(2)
    },
    notifications: {
        list: ko.observableArray([
            {type: "user", content: 'New admin added'},
//            {type: "sub", content: 'New subscriber added'},
//            {type: "group", content: 'New group added'},
        ]),
        unreadCount: ko.observable(2)
    },
    page: {
        pageName: "",
        description: "",
        menuIndex: 0
    },
    session: {
        username: ko.observable(),
        userid: "",
        hash: window.location.hash
    },
    api: "http://api.track-them-all.com/index.php/",
    init: function() {

    }
};
VM.common = function() {
    VM.get("messages/all", function(data) {
        VM.messages.list.removeAll();
        $.each(data, function(i, o) {
            VM.messages.list.push(o)
        });
    });
    VM.get("users", function(data) {
        VM.session.username(data.username);
        VM.session.id = data.id;
        UserVoice.push(['identify', {
                id: data.id,
                email: data.username
            }]);
    });
}
VM.post = function(url, data, callback) {
    return $.ajax({
        type: "POST",
        url: VM.api + url,
        data: data,
    }).done(function(data) {
        callback(data);
    }).fail(function(req) {
        var msg = JSON.parse(req.responseText).error.message;
        msg = msg.replace("Bad Request: ", "");
        VM.notify({
            title: 'Error Occured',
            text: msg,
            type: 'error'
        });
    })
}
VM.get = function(url, callback) {
    return $.ajax({
        type: "GET",
        url: VM.api + url,
    }).done(function(data) {
        callback(data);
    }).fail(function(req) {
        var error = JSON.parse(req.responseText).error;
        if (error.code === 401) {
            VM.notify({
                title: 'Session is not found',
                text: "You will be redirected to the login page.",
                type: 'error'
            });
            setTimeout(function() {
                window.location = 'login.html';
            }, 5000);
            return;
        }
        var msg = error.message.replace("Bad Request: ", "");
        VM.notify({
            title: 'Error Occured',
            text: msg,
            type: 'error'
        });
    })
}


VM.notify = function(options) {
    $.pnotify(options);
}

