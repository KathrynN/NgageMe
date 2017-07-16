
function initDatabase(){
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD0xyFmePkcQCXYl-5kY8QOBFabJgtWl8g",
    authDomain: "ngageme-942d1.firebaseapp.com",
    databaseURL: "https://ngageme-942d1.firebaseio.com",
    projectId: "ngageme-942d1",
    storageBucket: "ngageme-942d1.appspot.com",
    messagingSenderId: "825847385923"
  };
  firebase.initializeApp(config);
}
initDatabase();

function displayClass(){
		//provides visualisation for the students in the class.
			for(let i=0; i<classSize; i++){
				if(students[i]){
					var button = document.createElement("button");
					button.setAttribute("id", students[i].id);
					var body = document.getElementById("audienceIndicator");
					button.style.backgroundColor = engagementColours[students[i].engagement];
					button.innerHTML = students[i].name;
					body.appendChild(button);
					}
				
				}

}

function chartMe() {
		timeAxis = [];
		generateTimeAxis();
		let avgDataPoints = [];
		
		for(let i = 0; i<timeAxis.length; i++){
			avgDataPoints.push({x: i+1, y:engagementAvg[i]?engagementAvg[i]:null});
		}
    var chart = new CanvasJS.Chart("content",
    {
      theme: "theme9",
      title:{
        text: ""
      },
      axisX: {
        interval:maxClassTime/10,
		maximum:maxClassTime,
		includeZero:true,
		title: "Time"
      },
      axisY:{
        includeZero: false,
		title: "Engagement",
		maximum: 5,
		minimum: 1,
        interval:1
      },
      data: [
      {        
        type: "spline", 
		color: 	"#1abc9c",
		markerType: "none",
        dataPoints: avgDataPoints
      }
      ]	
    });

	chart.render();
}

function updateEngagementIndicator(){
			for(let i=0; i<classSize; i++){
				if(students[i]){
				let button = document.getElementById(students[i].id);
				button.style.backgroundColor = engagementColours[students[i].engagement];
				}
			}
}

function updateEngagementAvg(){
	let workingTotal = 0;
	let nonAbsent = 0;
	for(let i = 0; i<classSize; i++){
		if(students[i]){
		let engagement = students[i].engagement;
		workingTotal+=engagement;
		if(engagement!=0){
			nonAbsent++;
		}
		}
	}
	const averageEngagement = workingTotal/nonAbsent;
	engagementAvg.push(averageEngagement);
}



//for demo only
function randomiseEngagement(){

	refreshData();
	chartMe();
}

function refreshData(){

	firebase.database().ref().once('value', function(snapshot) {
	
      snapshot.forEach(function(childSnapshot){
        var data = childSnapshot.val();
		for(let i=0; i<students.length; i++){
			if(students[i].name===data.name){
				console.log(students[i].name + " was " + students[i].engagement + " and is now " + data.engagement);
				students[i].engagement = data.engagement;
			}
		}
      });
	  updateEngagementIndicator();
	  })
}

function createStudents(){
//	for(let i = 0; i<15; i++){
	//	students.push({id: i, name: "Student " + (i+1), engagement: 0});
//	}
	let id = 0;
	firebase.database().ref().once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot){
        var data = childSnapshot.val();
		data.id = id;
		id++;
		students.push(data);
		
      });
	displayClass();
  });
  
	
}

function generateTimeAxis(){
			for(let i = 0; i<(maxClassTime+1); i++){
				timeAxis.push(i);
			}
			
}


