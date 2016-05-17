#include <ros/ros.h>
#include <actionlib/server/simple_action_server.h>
#include <actionlib/client/simple_action_client.h>
#include <std_msgs/Bool.h>
#include <std_msgs/Int16.h>
#include <std_msgs/Float32.h>
#include <dji_sdk/dji_drone.h>
#include <dji_sdk_web_groundstation/WebWaypointReceiveAction.h>
#include <dji_sdk_web_groundstation/MapNavSrvCmd.h>
#include <dji_sdk_web_groundstation/Local.h>
#include <dji_sdk_web_groundstation/Global.h>
#include <dji_sdk_web_groundstation/Yrp.h>
#include <dji_sdk_web_groundstation/Way.h>
#include <dji_sdk_web_groundstation/Hot.h>



#include <dji_sdk/WaypointNavigationAction.h>

using namespace actionlib;

typedef dji_sdk_web_groundstation::WebWaypointReceiveAction Action_t;
typedef dji_sdk_web_groundstation::WebWaypointReceiveGoal Goal_t;
typedef dji_sdk_web_groundstation::WebWaypointReceiveGoalConstPtr GoalConstPtr_t;
typedef dji_sdk_web_groundstation::WebWaypointReceiveFeedback Feedback_t;
typedef dji_sdk_web_groundstation::WebWaypointReceiveResult Result_t;

typedef dji_sdk::WaypointNavigationAction WPAction_t;

SimpleActionServer<Action_t>* asPtr_;

DJIDrone* drone;

dji_sdk::MissionWaypointTask waypoint_task;
dji_sdk::MissionWaypoint 	 waypoint;
dji_sdk::MissionHotpointTask hotpoint_task;

uint8_t cmdCode_ = 0;
uint8_t stage_ = 0;
uint64_t tid_ = 0;
uint64_t cmdTid_ = 1;

uint8_t lat_p_; //latitude_progress
uint8_t lon_p_; //longitude_progress
uint8_t alt_p_; //altitude_progress
uint8_t idx_p_; //index_progress


void wp_feedbackCB(const dji_sdk::WaypointNavigationFeedbackConstPtr& fb) {
    lat_p_ = fb->latitude_progress;
    lon_p_ = fb->longitude_progress;
    alt_p_ = fb->altitude_progress;
    idx_p_ = fb->index_progress;
}

void goalCB() {
    Feedback_t fb;
    Result_t rslt;

    cmdCode_ = 0; //eliminate effect of last task
    Goal_t newGoal = *( asPtr_->acceptNewGoal() );
    ROS_INFO_STREAM( "Received goal: \n" << newGoal << "\n" );

    //********** stage code **********
    //*  0: waiting for waypointList
    //*  1: waiting for start
    //*  2: in progress
    //*  3: paused
    //*  4: canceled
    //********************************

    //check last task stage
    if(stage_ == 2) {
        rslt.result = false;
        asPtr_->setAborted(rslt, "Last task is in progress!");
        stage_ = 0;
        tid_ = 0;
        return;
    }
    if(stage_ == 3) {
        rslt.result = false;
        asPtr_->setAborted(rslt, "Last task is paused!");
        stage_ = 0;
        tid_ = 0;
        return;
    }

    tid_ = newGoal.tid;
    dji_sdk::WaypointList wpl = newGoal.waypoint_list;
    stage_ = 1;

    while(ros::ok()) {
        if(cmdCode_ == 'c') { //"c" for cancel
            //cmdCode_ = 0; //eliminate effect of next task
            ROS_INFO("Cancel task with tid %llu", tid_);
            stage_ = 4;
            fb.stage = stage_;
            asPtr_->publishFeedback(fb);
        } else if(tid_ == cmdTid_){
            if(cmdCode_ == 's' && stage_ == 1) { //"s" for start
                ROS_INFO("Start task with tid %llu", tid_);
                stage_ = 2;
                fb.stage = stage_;
                asPtr_->publishFeedback(fb);
                continue;
            }
            if(cmdCode_ == 'p' && stage_ == 2) { //"p" for pause
                ROS_INFO("Pause task with tid %llu", tid_);
                stage_ = 3;
                fb.stage = stage_;
                asPtr_->publishFeedback(fb);
                continue;
            }
            if(cmdCode_ == 'r' && stage_ == 3) { //"r" for resume
                ROS_INFO("Resume task with tid %llu", tid_);
                stage_ = 2;
                fb.stage = stage_;
                asPtr_->publishFeedback(fb);
                continue;
            }
        } else {
            if(cmdCode_ == 'n') { //"n" for newer waypointLine arrived
                ROS_INFO("A latest task arrived.");
                ROS_INFO("Set task(if any) with tid %llu preemted", newGoal.tid);
                stage_ = 4;
                fb.stage = stage_;
                asPtr_->publishFeedback(fb);
            }
        }

        /*ROS_INFO_ONCE("Stage: %d", stage_);
        ROS_INFO_ONCE("CmdCode: %d", cmdCode_);
        ROS_INFO_ONCE("tid: %llu", tid_);*/

        bool isFinished; //flag for task result
        int cnt; //feedback count
        switch(stage_) {
            case 0: //"0" for waiting for waypointList
                rslt.result = false;
                asPtr_->setAborted(rslt);
                ROS_INFO("The task is aborted for no waypointList received.");
                stage_ = 0;
                tid_ = 0;
                return;
            case 1: //"1" for waiting for start
            case 3: //"3" for paused
                continue;
            case 2: //"2" for in progress
                //wpClientPtr_->waitForServer();
                drone->takeoff();
                drone->waypoint_navigation_wait_server();
                
                //wpClientPtr_->sendGoal(wpGoal, 
                drone->waypoint_navigation_send_request(wpl,
                    SimpleActionClient<WPAction_t>::SimpleDoneCallback(), 
                    SimpleActionClient<WPAction_t>::SimpleActiveCallback(), 
                    &wp_feedbackCB
                );
                ROS_DEBUG("[DEBUG] The goal is sent!");

                //wait 1200*0.25s=300s until the task finishes
                cnt = 1200;
                while(ros::ok() && cnt--) {
                    fb.latitude_progress = lat_p_;
                    fb.longitude_progress = lon_p_;
                    fb.altitude_progress = alt_p_;
                    fb.index_progress = idx_p_;
                    asPtr_->publishFeedback(fb);
                    ROS_DEBUG_COND(cnt==1199, "[DEBUG] cmdCode_: %c", cmdCode_);
                    if(cmdCode_ == 'c') {
                        //cmdCode_ = 0; //eliminate effect of next task
                        rslt.result = false;
                        asPtr_->setAborted(rslt);
                        ROS_INFO("The task is canceled while executing.");
                        stage_ = 0;
                        tid_ = 0;
                        //wpClientPtr_->cancelGoal();
                        drone->waypoint_navigation_cancel_current_goal();
                        return;
                    }
                    isFinished = drone->waypoint_navigation_wait_for_result(); 
                }
                if(isFinished) {
                    ROS_INFO("Action finished: %s", 
                        drone->waypoint_navigation_get_state().toString().c_str()
                    );
                    rslt.result = true;
                    asPtr_->setSucceeded(rslt);
                } else {
                    ROS_INFO("The task cannot finish before the time out.");
                    rslt.result = false;
                    asPtr_->setAborted(rslt);
                }
                stage_ = 0;
                tid_ = 0;
                return;
            case 4: //"4" for canceled
                ROS_INFO("The task is canceled.");
                stage_ = 0;
                tid_ = 0;
                rslt.result = false;
                asPtr_->setPreempted(rslt);
                drone->waypoint_navigation_cancel_all_goals();
                return;
        }
    }
}

//TODO: preemptCB
void preemptCB() {
    ROS_INFO("Hey! I got preempt!");
}

void cmdCB(const dji_sdk_web_groundstation::MapNavSrvCmdConstPtr& msg) {
    ROS_INFO("Received command \"%c\" of tid %llu", msg->cmdCode, msg->tid);
    cmdCode_ = msg->cmdCode;
    cmdTid_ = msg->tid;
}

//TRUE for request control and FALSE for release control
void ctrlCB(const std_msgs::Bool::ConstPtr& msg) {
    if(msg->data)
        ROS_INFO("Request to obtain control");
    else
        ROS_INFO("Release control");

    drone->sdk_permission_control(msg->data);
    
}

//Add Video Function

void gacy(const std_msgs::Int16::ConstPtr& msg) {
	
	ROS_INFO("gimbal_angle_control_yaw(-3200,3200)0.1°");

	drone->gimbal_angle_control(0,0,msg->data,20);
	sleep(2);
}


void gacr(const std_msgs::Int16::ConstPtr& msg) {
	
	ROS_INFO("gimbal_angle_control_roll(-350,350)0.1°");

	drone->gimbal_angle_control(msg->data,0,0,20);
	sleep(2);

}

void gacp(const std_msgs::Int16::ConstPtr& msg) {
	
	ROS_INFO("gimbal_angle_control_pitch(-900,300)0.1°");

	drone->gimbal_angle_control(0,msg->data,0,20);
	sleep(2);

}




void yrp(const dji_sdk_web_groundstation::YrpConstPtr& msg) {
    
    ROS_INFO("test yrp");
    
    int yaw =  msg->yaw_value;
    int roll =  msg->roll_value;
    int pitch =  msg->pitch_value;        
    int duration = msg->duration_value;
            
    drone->gimbal_angle_control(yaw, roll, pitch, duration);
    sleep(2);

}




//Add Control Function

void up(const std_msgs::Int16::ConstPtr& msg) {

    ROS_INFO("up");
    int x = msg->data;

    for(int i = 0; i < 50*x; i ++)
    {
        if(i < 32*x)
            drone->attitude_control(0x40, 0, 0, 1, 0);
        else
            drone->attitude_control(0x40, 0, 0, 0, 0);
        usleep(20000);
    }
        
    sleep(2);

}



void down(const std_msgs::Int16::ConstPtr& msg) {

    ROS_INFO(" down");
    int x = msg->data;

    for(int i = 0; i < 50*x; i ++)
    {
        if(i < 32*x)
            drone->attitude_control(0x40, 0, 0, -1, 0);
        else
            drone->attitude_control(0x40, 0, 0, 0, 0);
        usleep(20000);
    }

    sleep(2);

}

void right(const std_msgs::Int16::ConstPtr& msg) {

    ROS_INFO(" right");
    int x = msg->data;


    for(int i = 0; i < 25*x; i ++)
    {
        if(i < 16*x)
            drone->attitude_control(0x40, 0, 2, 0, 0);
        else
            drone->attitude_control(0x40, 0, 0, 0, 0);
        usleep(20000);
    }
    
    sleep(2);

}

void left(const std_msgs::Int16::ConstPtr& msg) {

    ROS_INFO(" left   ");
    int x = msg->data;

    for(int i = 0; i < 25*x; i ++)
    {
        if(i < 16*x)
            drone->attitude_control(0x40, 0, -2, 0, 0);
        else
            drone->attitude_control(0x40, 0, 0, 0, 0);
        usleep(20000);
    }
    
    sleep(2);

}

void front(const std_msgs::Int16::ConstPtr& msg) {

    ROS_INFO(" front   ");
    int x = msg->data;


    for(int i = 0; i < 25*x; i ++)
    {
        if(i < 16*x)
            drone->attitude_control(0x40, 2, 0, 0, 0);
        else
            drone->attitude_control(0x40, 0, 0, 0, 0);
        usleep(20000);
    }
    
    sleep(2);

}

void back(const std_msgs::Int16::ConstPtr& msg) {

    ROS_INFO(" back  ");
    int x = msg->data;

    for(int i = 0; i < 25*x; i ++)
    {
        if(i < 16*x)
            drone->attitude_control(0x40, -2, 0, 0, 0);
        else
            drone->attitude_control(0x40, 0, 0, 0, 0);
        usleep(20000);
    }

    sleep(2);

}



void circle(const std_msgs::Float32::ConstPtr& msg) {

    ROS_INFO(" circle   ");
    int x = msg->data;

    static float time = 0;
    static float R = msg->data;
    static float V = msg->data;
    static float vx;
    static float vy;
    /* start to draw circle */
    for(int i = 0; i < 300; i ++)
    {
        vx = V * sin((V/R)*time/50.0f);
        vy = V * cos((V/R)*time/50.0f);

        drone->attitude_control( 0x83, vx,  vy, 0, 0 );

        usleep(20000);
        time++;
    }

    sleep(2);

}

void square(const std_msgs::Int16::ConstPtr& msg) {

    //TODO
   // msg->data

    ROS_INFO("   square ");
    /*draw square sample*/
    for(int i = 0;i < 60;i++)
    {
        drone->attitude_control(0x83,3,  3, 0, 0 );
        
        usleep(20000);
    }
    for(int i = 0;i < 60;i++)
    {
        drone->attitude_control(0x83, -3, 3, 0, 0 );

        usleep(20000);
    }
    for(int i = 0;i < 60;i++)
    {
        drone->attitude_control(0x83, -3, -3, 0, 0 );

        usleep(20000);
    }
    for(int i = 0;i < 60;i++)
    {
        drone->attitude_control(0x83, 3, -3, 0, 0 );

        usleep(20000);
    }
    
    sleep(2);

}

void local(const dji_sdk_web_groundstation::LocalConstPtr& msg) {
    ROS_INFO("%f,%f,%f", msg->x_value, msg->y_value,msg->z_value);
    float x =  msg->x_value;
    float y =  msg->y_value;
    float z =  msg->z_value;
    drone->local_position_navigation_send_request(x, y, z);
    
    sleep(2);

}


void global(const dji_sdk_web_groundstation::GlobalConstPtr& msg) {
    ROS_INFO("%f,%f,%f", msg->lati_value, msg->longi_value,msg->alti_value);
    double lati =  msg->lati_value;
    double longi =  msg->longi_value;
    float alti =  msg->alti_value;
    drone->global_position_navigation_send_request(lati, longi, alti);
    
    sleep(2);

}







void request(const std_msgs::Bool::ConstPtr& msg) {

    ROS_INFO(" request   ");
    drone->request_sdk_permission_control();
    sleep(2);

}

void release(const std_msgs::Bool::ConstPtr& msg) {

    ROS_INFO(" release   ");
    drone->release_sdk_permission_control();
    sleep(2);

}

void takeoff(const std_msgs::Bool::ConstPtr& msg) {

    ROS_INFO(" takeoff   ");
    drone->takeoff() ;
    sleep(2);

}

void land(const std_msgs::Bool::ConstPtr& msg) {

    ROS_INFO(" land   ");
    drone->landing() ;
    sleep(2);

}

void gohome(const std_msgs::Bool::ConstPtr& msg) {

    ROS_INFO("  gohome  ");
    drone->gohome() ;
    sleep(2);

}




void way(const dji_sdk_web_groundstation::WayPtr& msg) {

				waypoint_task.velocity_range = 10;
				waypoint_task.idle_velocity = 3;
				waypoint_task.action_on_finish = 0;
				waypoint_task.mission_exec_times = 1;
				waypoint_task.yaw_mode = 4;
				waypoint_task.trace_mode = 0;
				waypoint_task.action_on_rc_lost = 0;
				waypoint_task.gimbal_pitch_mode = 0;



				waypoint.latitude = msg->way1_lati;
				waypoint.longitude = msg->way1_longi;
				waypoint.altitude = msg->way1_alti;
				waypoint.damping_distance = 0;
				waypoint.target_yaw = 0;
				waypoint.target_gimbal_pitch = 0;
				waypoint.turn_mode = 0;
				waypoint.has_action = 0;
	
    

				waypoint_task.mission_waypoint.push_back(waypoint);

				waypoint.latitude = msg->way2_lati;
				waypoint.longitude = msg->way2_longi;
				waypoint.altitude = msg->way2_alti;
				waypoint.damping_distance = 0;
				waypoint.target_yaw = 0;
				waypoint.target_gimbal_pitch = 0;
				waypoint.turn_mode = 0;
				waypoint.has_action = 0;



				waypoint_task.mission_waypoint.push_back(waypoint);

				waypoint.latitude = msg->way3_lati;
				waypoint.longitude = msg->way3_longi;
				waypoint.altitude = msg->way3_alti;
				waypoint.damping_distance = 0;
				waypoint.target_yaw = 0;
				waypoint.target_gimbal_pitch = 0;
				waypoint.turn_mode = 0;
				waypoint.has_action = 0;



				waypoint_task.mission_waypoint.push_back(waypoint);



				drone->mission_waypoint_upload(waypoint_task);





    
    
    sleep(2);

}



void hot(const dji_sdk_web_groundstation::HotPtr& msg) {


    hotpoint_task.latitude = msg->hot_lati;
    hotpoint_task.longitude = msg->hot_longi;
    hotpoint_task.altitude = msg->hot_alti;
    hotpoint_task.radius = msg->hot_radius;
    hotpoint_task.angular_speed = msg->hot_speed;
    hotpoint_task.is_clockwise = msg->hot_clockwise;
    hotpoint_task.start_point = 0;
    hotpoint_task.yaw_mode = 0;

    drone->mission_hotpoint_upload(hotpoint_task);


    sleep(2);

}






int main(int argc, char* argv[]) {
    ros::init(argc, argv, "map_nav_srv");
    ros::NodeHandle nh;
    drone = new DJIDrone(nh);
    
    //web_waypoint_receive action server
    asPtr_ = new SimpleActionServer<Action_t>(
        nh, 
        "dji_sdk_web_groundstation/web_waypoint_receive_action", 
        false
    );

    //command subscribers
    ros::Subscriber sub1 = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/cmd", 1, cmdCB);
    ros::Subscriber sub2 = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/ctrl", 1, ctrlCB);

    ros::Subscriber sub3 = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/yaw", 1, gacy);
    ros::Subscriber sub4 = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/roll", 1, gacr);
    ros::Subscriber sub5 = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/pitch", 1, gacp);
    ros::Subscriber sub6 = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/yrp", 1, yrp);


    ros::Subscriber sub_up = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/up", 1, up);
    ros::Subscriber sub_down = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/down", 1, down);
    ros::Subscriber sub_right = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/right", 1, right);
    ros::Subscriber sub_left = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/left", 1, left);
    ros::Subscriber sub_front = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/front", 1, front);
    ros::Subscriber sub_back = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/back", 1, back);
    ros::Subscriber sub_circle = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/circle", 1, circle);
    ros::Subscriber sub_square = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/square", 1, square);
    ros::Subscriber sub_local = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/local", 1, local);
    ros::Subscriber sub_global = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/global", 1, global);

   
    ros::Subscriber sub_request = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/request", 1, request);
    ros::Subscriber sub_release = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/release", 1, release);
    ros::Subscriber sub_takeoff = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/takeoff", 1, takeoff);
    ros::Subscriber sub_land = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/land", 1, land);
    ros::Subscriber sub_gohome = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/gohome", 1, gohome);

    ros::Subscriber sub_way = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/way", 1, way);
    ros::Subscriber sub_hot = nh.subscribe("dji_sdk_web_groundstation/map_nav_srv/hot", 1, hot);





    asPtr_->registerGoalCallback(&goalCB);
    asPtr_->registerPreemptCallback(&preemptCB);
    asPtr_->start();

    //use multi thread to handle the subscribers.
    ros::MultiThreadedSpinner spinner(4);
    spinner.spin();

    return 0;
}
