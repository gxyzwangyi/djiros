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
        angle: {
            degree: elDebug.querySelector('.angle .degree .data')
        }
    };








    function bindNipple () {
        joystick
            .on('move', function (evt, data) {
            debug(data);
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
    function debug (obj) {
        function parseObj(sub, el) {
            for (var i in sub) {
                if (typeof sub[i] === 'object' && el) {
                    parseObj(sub[i], el[i]);
                } else if (el && el[i]) {
                    console.log(sub[i])

                    el[i].innerHTML = sub[i];
                }
            }
        }
        setTimeout(function () {
            parseObj(obj, els);
        }, 0);
    }
    

    
    
    

    
    
