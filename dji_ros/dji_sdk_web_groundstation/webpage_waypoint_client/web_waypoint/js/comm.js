var home_lat = 0;
var home_lon = 0;
var home_hei = 0;

var isExecuted = false;


function Communicator(socket) {

    //rosbridge config
    this.ros = new ROSLIB.Ros({
        url : socket.url
    });

    this.ros.on('connection', function(){
        console.log('Connected to websocket server.');
        $( '<div>Connected to websocket server.</div>' ).appendTo("#monitor");
    });
    this.ros.on('error', function(){
        console.log('Error connecting to websocket server: ', error);
        $( '<div>Error connecting to websocket server: '+error+'</div>' ).appendTo("#monitor");
    });
    this.ros.on('close', function(){
        console.log('Connection is closed!.');
        $( '<div>Connection is closed!</div>' ).appendTo("#monitor");
    });

    this.tid = 0;

    //action client
    this.web_wp_client = new ROSLIB.ActionClient({
        ros : this.ros,
        serverName : 'dji_sdk_web_groundstation/web_waypoint_receive_action',
        actionName : 'dji_sdk_web_groundstation/WebWaypointReceiveAction'
    });;

    //publisher
    this.ctrlTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/ctrl',
        messageType : 'std_msgs/Bool'
    });
    this.cmdTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/cmd',
        messageType : 'dji_sdk_web_groundstation/MapNavSrvCmd'
    });
    
    
    
	//Add Video Topic
    this.yamTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/yam',
        messageType : 'std_msgs/Int16'
    });	
	
    this.rollTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/roll',
        messageType : 'std_msgs/Int16'
    });	
	
    this.pitchTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/pitch',
        messageType : 'std_msgs/Int16'
    });	
	
    this.yrpTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/yrp',
        messageType : 'std_msgs/Bool'
    });	
		    
    //Add Control Topic
    
    this.upTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/up',
        messageType : 'std_msgs/Int16'
    });
    

    this.downTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/down',
        messageType : 'std_msgs/Int16'
    });
    

    this.rightTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/right',
        messageType : 'std_msgs/Int16'
    });
    

    this.leftTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/left',
        messageType : 'std_msgs/Int16'
    });
    

    this.frontTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/front',
        messageType : 'std_msgs/Int16'
    });
    

    this.backTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/back',
        messageType : 'std_msgs/Int16'
    });
    

    this.circleTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/circle',
        messageType : 'std_msgs/Int16'
    });
    

    this.squareTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/square',
        messageType : 'std_msgs/Int16'
    });
    

    this.takeoffTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/takeoff',
        messageType : 'std_msgs/Bool'
    });
    

    this.landTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/land',
        messageType : 'std_msgs/Bool'
    });
    

    this.gohomeTopic = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk_web_groundstation/map_nav_srv/gohome',
        messageType : 'std_msgs/Bool'
    });
    
    
    
    
    
    
    
    
   
   
    //subscriber
    this.rosListener = new ROSLIB.Topic({
        ros : this.ros,
        name : 'dji_sdk/global_position',
        messageType : 'dji_sdk/GlobalPosition'
    });
    this.rosListener.subscribe(function(msg) {
        home_lat = msg.latitude;
        home_lon = msg.longitude;
        home_hei = msg.height;
    });
}

Communicator.prototype.setNavigationMode = function() {

    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('Request to obtain control');
    this.ctrlTopic.publish(_msg);

};

Communicator.prototype.stopNavigationMode = function() {

    var _msg = new ROSLIB.Message({
        data : false
    });

    console.log('Release control');
    this.ctrlTopic.publish(_msg);

};

Communicator.prototype.uploadWayline = function() {

    isExecuted = false;

    if (my_planner.markerList.length < 2){
        alert("Please set 2 waypoints at least!");
        return;
    }

    // rosbridge config
    this.tid = new Date().getTime();
    var _msg = new ROSLIB.Message({
        cmdCode : "n".charCodeAt(0),
        tid : this.tid
    });
    console.log('Upload new waypointLine');
    this.cmdTopic.publish(_msg);

    var _waypointList = new Array();
    for(i = 0; i < my_planner.markerList.length; i++) {
        var _wp = new ROSLIB.Message({
            latitude : my_planner.markerList[i][1].point.lat,
            longitude : my_planner.markerList[i][1].point.lng,
            altitude : my_planner.markerList[i][2].alti,
            heading : 0,
            staytime : 0
        });
        _waypointList.push(_wp);
    }
    var goal_waypointList = {
        waypoint_list : _waypointList
    };
    var goal = new ROSLIB.Goal({
        actionClient : this.web_wp_client,
        goalMessage : {
            waypoint_list : goal_waypointList,
            tid : this.tid
        }
    });

    goal.on('feedback', function(feedback) {
        //console.log('Feedback: current stage ' + feedback.stage);
        var stageMsg = '';
        switch(feedback.stage) {
            case 0:
                stageMsg = 'waiting for waypointList'; break;
            case 1:
                stageMsg = 'waiting for start'; break;
            case 2:
                stageMsg = 'in progress'; break;
            case 3:
                stageMsg = 'paused'; break;
            case 4:
                stageMsg = 'canceled'; break;
        }

        var str = '<div>Feedback: current stage ' + feedback.stage + ' - '
            + stageMsg + '</div>'
            + '<div>Latitude progress: ' + feedback.latitude_progress + '%</div>'
            + '<div>Longitude progress: ' + feedback.longitude_progress + '%</div>'
            + '<div>Altitude progress: ' + feedback.altitude_progress + '%</div>'
            + '<div>Index progress: ' + feedback.index_progress + '</div>';
        $("#state-update").empty();
        $( str ).appendTo("#state-update");
    });

    goal.on('result', function(result) {
        if(result.result) {
            console.log('Execution Succeed!');
            alert('Execution Succeed!');
        } else {
            console.log('Last Execution Fail!');
            if(isExecuted) alert('Last Execution Fail!');
        }
    });

    goal.send();
};


Communicator.prototype.startWayline = function() {

    isExecuted = true;

    var _msg = new ROSLIB.Message({
        cmdCode : "s".charCodeAt(0),
        tid : this.tid
    });

    console.log('Start task with tid ' + this.tid);
    this.cmdTopic.publish(_msg);

};

Communicator.prototype.cancelWayline = function() {

    //The function is not defined
    //this.web_wp_client.cancel();

    var _msg = new ROSLIB.Message({
        cmdCode : "c".charCodeAt(0),
        tid : this.tid
    });

    console.log('Cancel current task');
    this.cmdTopic.publish(_msg);

};

//TODO: have't implemented this function in ROS yet
Communicator.prototype.pauseWayline = function() {

    var _msg = new ROSLIB.Message({
        cmdCode : "p".charCodeAt(0),
        tid : this.tid
    });

    console.log('Pause task with tid ' + this.tid);
    this.cmdTopic.publish(_msg);

};

//TODO: have't implemented this function in ROS yet
Communicator.prototype.continueWayline = function() {

    var _msg = new ROSLIB.Message({
        cmdCode : "r".charCodeAt(0),
        tid : this.tid
    });

    console.log('Resume task with tid ' + this.tid);
    this.cmdTopic.publish(_msg);

};



//Add Video
Communicator.prototype.setGimbalControlYam = function() {

    var _msg = new ROSLIB.Message({
        data : 100
    });

    console.log('setGimbalControlYam');
    this.yamTopic.publish(_msg);

};

Communicator.prototype.setGimbalControlRoll = function() {

    var _msg = new ROSLIB.Message({
        data : 100
    });

    console.log('setGimbalControlRoll');
    this.rollTopic.publish(_msg);

};

Communicator.prototype.setGimbalControlPitch = function() {

    var _msg = new ROSLIB.Message({
        data : 100
    });

    console.log('setGimbalControlPitch');
    this.pitchTopic.publish(_msg);

};


Communicator.prototype.setYRP = function() {

    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('yrp');
    this.yrpTopic.publish(_msg);

};

// Add Control

Communicator.prototype.setup = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('up');
    this.upTopic.publish(_msg);
};

Communicator.prototype.setdown = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('down');
    this.downTopic.publish(_msg);
};

Communicator.prototype.setright = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('right');
    this.rightTopic.publish(_msg);
};

Communicator.prototype.setleft = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('left');
    this.leftTopic.publish(_msg);
};

Communicator.prototype.setfront = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('front');
    this.frontTopic.publish(_msg);
};

Communicator.prototype.setback = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('back');
    this.backTopic.publish(_msg);
};

Communicator.prototype.setcircle = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('circle');
    this.circleTopic.publish(_msg);
};

Communicator.prototype.setsquare = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('square');
    this.squareTopic.publish(_msg);
};

Communicator.prototype.settakeoff = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('takeoff');
    this.takeoffTopic.publish(_msg);
};

Communicator.prototype.setland = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('land');
    this.landTopic.publish(_msg);
};

Communicator.prototype.setgohome = function() {
    var _msg = new ROSLIB.Message({
        data : true
    });

    console.log('gohome');
    this.gohomeTopic.publish(_msg);
};

