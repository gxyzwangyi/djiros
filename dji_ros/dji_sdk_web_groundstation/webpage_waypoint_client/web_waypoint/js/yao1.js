    var s = function (sel) { return document.querySelector(sel); };
    var sId = function (sel) { return document.getElementById(sel); };
    var removeClass = function (el, clss) {
        el.className = el.className.replace(new RegExp('\\b' + clss + ' ?\\b', 'g'), '');
    }  
        var joysticks1 = {
        semi1: {
            zone: s('.zone1.semi1'),
            mode: 'semi',
            catchDistance: 150,
            color: 'white',
            fadeTime: 500 ,
            threshold: 0.1

        }
    };
    
    var joystick1;


    var elDebug1 = sId('debug1');
    var els1 = {
        distance: elDebug1.querySelector('.distance1 .data1'),
        angle: {
            degree: elDebug1.querySelector('.angle1 .degree1 .data1')
        }

    };
    
    
    function bindNipple1 () {

        joystick1
            .on('move', function (evt1, data1) {
            debug1(data1);
        })


    }
    
    function createNipple1 (evt1) {
        var type = typeof evt1 === 'string' ?
            evt1 : evt1.target.getAttribute('data-type');
        if (joystick1) {
            joystick1.destroy();
        }
        removeClass(s('.zone1.active1'), 'active1');
          s('.zone1.' + type).className += ' active1';
        joystick1 = nipplejs.create(joysticks1[type]);

        bindNipple1();

    }
    
        createNipple1('semi1');


    function debug1 (obj1) {

        function parseObj(sub1, el1) {
            for (var i in sub1) {
                if (typeof sub1[i] === 'object' && el1) {
                   console.log(sub1);
                   console.log(el1);

                    parseObj(sub1[i], el1[i]);
                } else if (el1 && el1[i]) {

                    console.log(sub1[i])
                    el1[i].innerHTML = sub1[i];
                }
            }
        }
        setTimeout(function () {
            parseObj(obj1, els1);
        }, 0);
    }
    
    
    
