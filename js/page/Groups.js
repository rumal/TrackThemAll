VM.page = {
    pageName: "Groups",
    description: "Manage Groups",
    menuIndex: 1
};

VM.group = {
    list: ko.observableArray(),
    addGroup: function() {
        var name = $("#name").val();
        var hash = $("#hash").val();
        VM.post("groups", {
            name: name,
            hash: hash
        }, function() {
            $.pnotify({
                title: 'Group Registration Success',
                type: 'success'
            });
            VM.group.update();
            $("#name").val("");
            $("#hash").val("");
        });
    },
    update: function() {
        VM.get("groups/all", function(data) {
            VM.group.list.removeAll();
            $.each(data, function(i, o) {
                VM.group.list.push(o);
            });
            $.pnotify({
                title: 'Groups Loaded',
                type: 'success'
            });
        })
    }
}

VM.init = function() {
    VM.group.update();
}