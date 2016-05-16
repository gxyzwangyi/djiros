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
    var joysticks1 = {
        semi: {
            zone: s('.zone1.semi'),
            mode: 'semi',
            catchDistance: 150,
            color: 'white',
            fadeTime: 500 ,
            threshold: 0.1

        }
    };
    
    
    
    var joystick;
    var joystick1;

    // Get debug elements and map them
    var elDebug = sId('debug');
    var elDump = elDebug.querySelector('.dump');
    var els = {
        distance: elDebug.querySelector('.distance .data'),
        angle: {
            degree: elDebug.querySelector('.angle .degree .data')
        }

    };


    var elDebug1 = sId('debug1');
    var elDump1 = elDebug1.querySelector('.dump1');
    var els1 = {
        distance: elDebug1.querySelector('.distance1 .data1'),
        angle: {
            degree: elDebug1.querySelector('.angle1 .degree1 .data1')
        }

    };






    function bindNipple () {
        joystick
            .on('move', function (evt, data) {
            debug(data);
        })

    }
    
    function bindNipple1 () {
        joystick1
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
        removeClass(s('.highlight.active'), 'active');
        s('.highlight.' + type).className += ' active';
        s('.zone.' + type).className += ' active';
        joystick = nipplejs.create(joysticks[type]);
        bindNipple();
    }
    
        function createNipple1 (evt) {
        var type = typeof evt === 'string' ?
            evt : evt.target.getAttribute('data-type');
        if (joystick1) {
            joystick1.destroy();
        }
        removeClass(s('.zone1.active'), 'active');
        removeClass(s('.highlight1.active'), 'active');
        s('.highlight1.' + type).className += ' active';
        s('.zone1.' + type).className += ' active';
        joystick1 = nipplejs.create(joysticks1[type]);
        bindNipple1();
    }
    
    createNipple('semi');
    //createNipple1('semi');
    

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

    var nbEvents = 0;

    // Dump data
    function dump (evt) {
        setTimeout(function () {
            if (elDump.children.length > 4) {
                elDump.removeChild(elDump.firstChild);
            }
            var newEvent = document.createElement('div');
            newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
                evt + '</span>';
            elDump.appendChild(newEvent);
            nbEvents += 1;
        }, 0);
    }    
    
    
    var nbEvents1 = 0;
    function dump1 (evt) {
        setTimeout(function () {
            if (elDump1.children.length > 4) {
                elDump1.removeChild(elDump1.firstChild);
            }
            var newEvent = document.createElement('div');
            newEvent.innerHTML = '#' + nbEvents1 + ' : <span class="data1">' +
                evt + '</span>';
            elDump1.appendChild(newEvent1);
            nbEvents1 += 1;
        }, 0);
    }