    var s = function (sel) { return document.querySelector(sel); };
    var sId = function (sel) { return document.getElementById(sel); };
    var removeClass = function (el, clss) {
        el.className = el.className.replace(new RegExp('\\b' + clss + ' ?\\b', 'g'), '');
    }
    var joysticks = {
        semi: {
            zone: s('.zone.semi'),
            mode: 'semi',
            catchDistance: 150,
            color: 'white',
            fadeTime: 500 ,
            threshold: 0.1

        }
    };

    
    
    
    var joystick;

    // Get debug elements and map them
    var elDebug = sId('debug');
    var els = {
        distance: elDebug.querySelector('.distance .data'),
           degree : elDebug.querySelector('.degree .data')
        
    };








    function bindNipple () {
        joystick
            .on('move', function (evt, data) {
            //debug(data);
            run(data);
        })

    }
    


    function createNipple (evt) {
        var type = typeof evt === 'string' ?
            evt : evt.target.getAttribute('data-type');
        if (joystick) {
            joystick.destroy();
        }
        removeClass(s('.zone.active'), 'active');
         s('.zone.' + type).className += ' active';
        joystick = nipplejs.create(joysticks[type]);
        bindNipple();
    }
    

    
    createNipple('semi');
    

    // Print data into elements


        function run (obj) {
        function push(sub,el) {           

           var distance = sub["distance"];
           var degree =  sub["angle"]["degree"]*2*3.14159/360;
           var yaw = 1024+Math.cos(degree)*distance*66/5 ;
           var throttle = 1024+Math.sin(degree)*distance*66/5 ;
           el["distance"].innerHTML = yaw;
           el["degree"].innerHTML = throttle;

           my_Communicator.setyt(yaw,throttle);

        
        }
        setTimeout(function () {
            push(obj,els);
        }, 0);
    }
    
    

    




