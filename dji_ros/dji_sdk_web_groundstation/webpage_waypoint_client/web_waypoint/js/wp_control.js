
var dji_home= new BMap.Point(113.958004, 22.542494);

$( document ).ready(function() {
	my_socket = new WebSocket("ws://localhost:19871");
	my_Communicator= new Communicator(my_socket);

	// create map
	map = new BMap.Map("allmap");
	map.centerAndZoom(dji_home, 15);
	map.enableScrollWheelZoom();
	map.disableDoubleClickZoom();
	map.enableKeyboard();
	// create planner
	my_planner = new Planner(map);
	my_planner.reset();

	//bind events to control panel wadgets
	$( "#start-plan" ).bind( "click", function() {

		//my_Communicator.getGlobalPosition();
		console.log('Home position: ' + home_lon + ', ' + home_lat);
		if(home_lon == 0 || home_lat == 0){
			alert("Home Location Not Recorded!");
			return;
		}
			
		var drone_home = new BMap.Point(home_lon, home_lat);
		map.setCenter(drone_home);

		if (my_planner.isStandby())
		{
			my_planner.addFirstMarker(drone_home);
			my_planner.enableMapClick();
		}
		else if (my_planner.isFinished())
		{
			my_planner.continuePlanning();
		}
	});

	$("#confirm-mission").bind("click", function() {
		my_planner.confirmMission();
	});

    $("#reset-mission").bind("click", function() {
		my_planner.reset();
        $("#monitor").empty();
	});

	$("#upload-mission").bind("click", function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
            my_Communicator.uploadWayline();
	});

	$("#open-navmode").bind("click", function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
            my_Communicator.setNavigationMode();
	});

	$("#start-mission").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
            my_Communicator.startWayline();

	});

	$("#cancel-mission").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.cancelWayline();

	});

	$("#close-navmode").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.stopNavigationMode();

	});
//Add Video function

		$("#gimbal-angel-yam").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setGimbalControlYam();

	});
	
		$("#gimbal-angel-roll").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setGimbalControlRoll();

	});
	
		$("#gimbal-angel-pitch").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setGimbalControlPitch();

	});
	
		$("#yrp-test").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setYRP();

	});	
	
	
	//Add Control function
	
	
		$("#takeoff").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.settakeoff();

	});	
	
		$("#land").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setland();

	});
	
	
		$("#gohome").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setgohome();

	});	
	
		$("#up").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setup(document.getElementById("up_value").value);

	});	
	
	
		$("#down").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setdown();

	});	
	
		$("#right").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setright();

	});			
        $("#left").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setleft();

    });	

        $("#front").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setfront();

    });	

        $("#back").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setback();

    });	

        $("#circle").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setcircle();

    });	

        $("#square").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setsquare();

    });	


	
	
	
	
	
	
	
	
	
	
	
});

