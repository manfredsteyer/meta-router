var MetaRouter = require('meta-spa-router').MetaRouter;

var config = [
    {
        path: 'a',
        app: '/app-a/dist',
        outlet: 'outlet'
    },
    {
        path: 'b',
        app: '/app-b/dist',
        outlet: 'outlet'
    }
];


window.addEventListener('load', function() { 

    var router = new MetaRouter();
    router.config(config);
    router.init();
    router.preload();

    router.additionalConfig.handleNotification = function (tag, data)  {
        console.debug('received message from routed app', {tag, data});
    }


    document.getElementById('link-a')
            .addEventListener('click', function() { router.go('a') });

    document.getElementById('link-b')
            .addEventListener('click', function() { router.go('b') });

    document.getElementById('link-aa')
            .addEventListener('click', function() { router.go('a', 'a') });

            document.getElementById('link-ab')
            .addEventListener('click', function() { router.go('a', 'b') });        

}); 
