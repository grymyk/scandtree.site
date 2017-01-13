'use strict';

let template;

let serverUrl = 'https://expigrt.herokuapp.com';

//let socket = io.connect('http://localhost:5000');
let socket = io.connect(serverUrl);

let templateUrl = serverUrl + '/templates/item.hbs';

$.get(templateUrl, (data) => {
    template = Handlebars.compile(data);
}, 'html')
.done( () => {
    console.log("second success");
})
.fail( () => {
    console.log("error");
})
.always( () => {
    console.log("finished");
});

Handlebars.registerHelper('human_time', (timestamp) => {
    return moment.unix(timestamp).fromNow();
});

socket.on('fotos', (data) => {
    console.log(data);

    let gallery_holder = $('#gallery').find('.gallery');

    let html = template(data);

    $(html).hide();

    gallery_holder
        .empty()
        .append( $(html) )
        .fadeIn('slow');

    //$(html).hide().insertBefore(gallery_holder).fadeIn('slow');
});
