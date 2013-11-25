VM.page = {
    pageName: "Group",
    description: "Manage group members and locations",
    menuIndex: 1,
    hash: ""
};

VM.subscribers = {
    list: ko.observableArray(),
    remove: function() {
        console.log(this);
    },
    addToList: function(data) {
        var map = VM.subscribers.map;
        $.each(data, function(i, o) {
            var loc = o.location;
            o.marker = map.addMarker({
                lat: loc.lat,
                lng: loc.lng,
                title: o.name,
                infoWindow: {
                    content: "<h3>" + o.name + "</h3><p>" + o.time + "</p>"
                }
            });
            VM.subscribers.list.push(o);
        });
    },
};


VM.chat = {
    list: ko.observableArray([
    ]),
    message: ko.observable(""),
    send: function() {
        VM.post("messages/group", {
            message: VM.chat.message(),
            hash: VM.page.hash
        }, function() {
            VM.chat.message("");
            VM.notify({
                text: "Message sent"
            });
            VM.chat.update();
        });
    },
    update: function() {
        VM.get("messages/group/" + VM.page.hash, function(data) {
            VM.chat.list.removeAll();
            $.each(data, function(i, o) {
                VM.chat.list.push(o)
            });
        });
    }
};

VM.init = function() {
    var hash = window.location.hash.substr(1);
    VM.page.hash = hash;
    VM.get("groups/group/" + hash, function(data) {
        VM.subscribers.list.removeAll();

        var map = data.map;
        VM.subscribers.map = new GMaps({
            div: '#map',
            lat: map.lat,
            lng: map.lng
        });

        VM.subscribers.addToList(data.subs);

        $.pnotify({
            title: 'Group data loaded',
            type: 'success'
        });
    });
    VM.chat.update();
};

