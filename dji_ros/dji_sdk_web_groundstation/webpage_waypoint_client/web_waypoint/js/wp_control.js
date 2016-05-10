
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

		$("#yaw").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");		
		else
			my_Communicator.setGimbalControlYaw(document.getElementById("yaw_value").value);
	
	});
	

	
	
	
		$("#roll").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setGimbalControlRoll(document.getElementById("roll_value").value);

	});
	
		$("#pitch").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setGimbalControlPitch(document.getElementById("pitch_value").value);

	});
	
		$("#yrp").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			var yaw = document.getElementById("yaw_value").value
            var roll = document.getElementById("roll_value").value
			var pitch = document.getElementById("pitch_value").value
			var duration = document.getElementById("duration_value").value

			my_Communicator.setYRP(yaw,roll,pitch,duration);

	});	
	
	
	//Add Control function
	
	
		$("#request").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setrequest();

	});		
	
		$("#release").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setrelease();

	});		
	
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
            my_Communicator.setdown(document.getElementById("down_value").value);

    });	

        $("#right").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setright(document.getElementById("right_value").value);

    });	

        $("#left").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setleft(document.getElementById("left_value").value);

    });	

        $("#front").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setfront(document.getElementById("front_value").value);

    });	

        $("#back").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setback(document.getElementById("back_value").value);

    });	

        $("#circle").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setcircle(document.getElementById("circle_value").value);

    });	

        $("#square").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setsquare(document.getElementById("square_value").value);

    });	



        $("#local").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
			var x = document.getElementById("x_value").value
            var y = document.getElementById("y_value").value
			var z=  document.getElementById("z_value").value
			my_Communicator.setlocal(x,y,z);

    });	

	
        $("#global").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
			var lati = document.getElementById("lati_value").value
            var longi = document.getElementById("longi_value").value
			var alti=  document.getElementById("alti_value").value
			my_Communicator.setglobal(lati,longi,alti);

    });	

	
	
	
	
	
	
	
	
});

