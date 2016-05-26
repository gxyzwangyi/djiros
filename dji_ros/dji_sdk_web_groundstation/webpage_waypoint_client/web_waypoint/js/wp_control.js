
var dji_home= new BMap.Point(0.0001, 0.0001);

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
			my_Communicator.setGimbalControlYaw(document.getElementById("yaw_value").value-320);
	
	});
	
		$("#roll").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setGimbalControlRoll(document.getElementById("roll_value").value-35);

	});
	
		$("#pitch").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setGimbalControlPitch(document.getElementById("pitch_value").value-90);

	});
	
		$("#yrp").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			var yaw = document.getElementById("y_yrp").value-320
            var roll = document.getElementById("r_yrp").value-35
			var pitch = document.getElementById("p_yrp").value-90
			var duration = document.getElementById("d_yrp").value



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
	
		$("#over").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setover();

	});	
	
		$("#arm").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setarm(true);

	});	
	
	
		$("#disarm").bind("click",function() {
		if (typeof(my_Communicator) == 'undefined')
			alert("Drone not Connected!");
		else
			my_Communicator.setarm(false);

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
			var x = document.getElementById("x_local").value
            var y = document.getElementById("y_local").value
			var z=  document.getElementById("z_local").value
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

	
	
	    $("#way_upload").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
		
			var way1_lati = document.getElementById("way1_lati").value
            var way1_longi = document.getElementById("way1_longi").value
			var way1_alti=  document.getElementById("way1_alti").value		
		
			var way2_lati = document.getElementById("way2_lati").value
            var way2_longi = document.getElementById("way2_longi").value
			var way2_alti=  document.getElementById("way2_alti").value		

			var way3_lati = document.getElementById("way3_lati").value
            var way3_longi = document.getElementById("way3_longi").value
			var way3_alti=  document.getElementById("way3_alti").value	
		

			var way4_lati = document.getElementById("way4_lati").value
            var way4_longi = document.getElementById("way4_longi").value
			var way4_alti=  document.getElementById("way4_alti").value	
				
		
			var way_list=new Array();
			way_list[0] = new Array(way1_lati,way1_longi,way1_alti);
			way_list[1] = new Array(way2_lati,way2_longi,way2_alti);
			way_list[2] = new Array(way3_lati,way3_longi,way3_alti);
			way_list[3] = new Array(way4_lati,way4_longi,way4_alti);

		

			my_Communicator.setway(way_list);

    });	
	
	

	    $("#cover_upload").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
		
			var way1_lati = document.getElementById("way1_lati").value
            var way1_longi = document.getElementById("way1_longi").value
			var way1_alti=  document.getElementById("way1_alti").value		
		
			var way2_lati = document.getElementById("way2_lati").value
            var way2_longi = document.getElementById("way2_longi").value
			var way2_alti=  document.getElementById("way2_alti").value		

			var way3_lati = document.getElementById("way3_lati").value
            var way3_longi = document.getElementById("way3_longi").value
			var way3_alti=  document.getElementById("way3_alti").value	
		

			var way4_lati = document.getElementById("way4_lati").value
            var way4_longi = document.getElementById("way4_longi").value
			var way4_alti=  document.getElementById("way4_alti").value	
				
		
			var way_list=new Array();
			way_list[0] = new Array(way1_lati,way1_longi,way1_alti);
			way_list[1] = new Array(way2_lati,way2_longi,way2_alti);
			way_list[2] = new Array(way3_lati,way3_longi,way3_alti);
			way_list[3] = new Array(way4_lati,way4_longi,way4_alti);

		

			my_Communicator.setcover(way_list);

    });	

	
	
	
	
	    $("#hot_upload").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
		
		
			var lati = document.getElementById("hot_lati").value
            var longi = document.getElementById("hot_longi").value
			var alti=  document.getElementById("hot_alti").value
			var speed=  document.getElementById("hot_speed").value
			var radius=  document.getElementById("hot_radius").value
			if (document.getElementById("clockwise").value == "顺")
				var clockwise = 1 
			else
				var clockwise = 0

			
			
			my_Communicator.sethot(lati,longi,alti,speed,radius,clockwise);

    });	
	
	
	
	    $("#start").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setstart();

    });	

        $("#pause").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setpause();

    });	

        $("#resume").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setresume();

    });	

        $("#cancel").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setcancel();
    });	
	
	
	
	

	
	
	

		$("#refresh").bind("click",function() {
        if (typeof(my_Communicator) == 'undefined')
            alert("Drone not Connected!");
        else
            my_Communicator.setrefresh();
    });	
	
	
	
	
		window.setInterval(showalert, 3000); 
		function showalert() 
		{ 
		my_Communicator.setrefresh();
		} 

	

	
	
	
	
	
});

