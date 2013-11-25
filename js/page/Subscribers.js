VM.page = {
    pageName: "Subscribers",
    description: "Manage Subscribers",
    menuIndex: 2
};

VM.subscribers = {
    list: ko.observableArray([
        {id: "2", name: "My Name", groups: [{id: 2, name: "abs"}, {id: 3, name: "bs"}]}
    ]),
    update: function() {
        VM.subscribers.list.removeAll();
        VM.get("subscribers/all", function(data) {
            VM.subscribers.list.removeAll();
            $.each(data, function(i, o) {
                VM.subscribers.list.push(o);
            })
            $.pnotify({
                title: 'Subscribers Loaded',
                type: 'success'
            });
        })
    }
}

VM.init = function() {
    VM.subscribers.update();
}