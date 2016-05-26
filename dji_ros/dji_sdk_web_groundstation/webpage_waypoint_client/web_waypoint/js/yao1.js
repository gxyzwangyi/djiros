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
        degree: elDebug1.querySelector('.degree1 .data1')

    };
    
    
    function bindNipple1 () {
        joystick1
            .on('move', function (evt1, data1) {
            run1(data1);
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


    function run1 (obj) {
        function push(sub,el) {           

            var distance = sub["distance"];
            var degree =  sub["angle"]["degree"]*2*3.14159/360;
            var roll = 1024+Math.cos(degree)*distance*66/5 ;
            var pitch = 1024+Math.sin(degree)*distance*66/5 ;
            el["distance"].innerHTML = roll;
            el["degree"].innerHTML = pitch;


            var mode = 1552

            if (document.getElementById("is_rc").value == "A" )
            {
                mode = 496
            }
            else if(document.getElementById("is_rc").value == "F")
            {
                mode = 1024
            }
            else
            {
                mode = 1552
            }
 



            my_Communicator.setrp(roll,pitch,mode);

        }
        setTimeout(function () {
            push(obj,els1);
        }, 0);
    }
    
    
    
