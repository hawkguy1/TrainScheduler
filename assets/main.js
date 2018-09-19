console.log("SCRIPT LOADED")
// -- INITIALIZE FIREBASE -- //
var config = {
  apiKey: "AIzaSyB6Du2NXeN4CXlMrS2htGaYLtc6uPaoK6o",
  authDomain: "my-train-scheduler-project.firebaseapp.com",
  databaseURL: "https://my-train-scheduler-project.firebaseio.com",
  projectId: "my-train-scheduler-project",
  storageBucket: "my-train-scheduler-project.appspot.com",
  messagingSenderId: "916874916677"
};
firebase.initializeApp(config);
// -- FIREBASE REFERENCE -- //
var dataRef = firebase.database();
// -- TRAIN ADDER CLICK EVENT -- //
$(document).on("click", "#submit-button", function (event) {
  console.log("FUNCTION TRIGGER");
  event.preventDefault();
  // -- GATHER VALUES FROM FIELDS -- //
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#train-destination").val().trim();
  var trainFrequency = $("#train-frequency").val().trim();
  var firstTrainTime = moment($("#first-train-time").val().trim(), "HH:mm").format("X");
  console.log(trainName, trainDestination, trainFrequency, firstTrainTime);
  // -- PUSH TO FIREBASE -- //
  dataRef.ref().push({
    trainName: trainName,
    trainDestination: trainDestination,
    trainFrequency: trainFrequency,
    firstTrainTime: firstTrainTime,
  });
  console.log("SENT DATA TO FIREBASE");
  // -- ADDS THE VALUE OF FIELDS TO HTML -- //
  $("#train-name").val("");
  $("#train-destination").val("");
  $("#train-frequency").val("");
  $("#first-train-time").val("");
});
// -- TURNS DATA INTO A DATABASE ON FIREBASE -- //
dataRef.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  var trainName = childSnapshot.val().trainName;
  var trainDestination = childSnapshot.val().trainDestination;
  var trainFrequency = childSnapshot.val().trainFrequency;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  console.log("TRAIN NAME:", trainName, "DESTINATION:", trainDestination, "TRAIN FREQUENCY:", trainFrequency, "FIRST TRAIN TIME:", firstTrainTime);
  var nextTrainTime = moment.unix(firstTrainTime);
  var currentTime = moment();
  console.log("NEXT TRAIN TIME:", nextTrainTime, "CURRENT TIME:", currentTime);
  // -- POPULATES THE ARRIVAL TIME OF THE NEXT TRAIN -- //
  while (nextTrainTime.diff(currentTime) < 0) {
    nextTrainTime.add(trainFrequency, "m");
    console.log("NEXT TRAIN TIME:", nextTrainTime);
  }
  // -- CREATING THE MINUTES LEFT VARIABLE -- //
  var timeDiff = moment.duration(nextTrainTime.diff(currentTime));
  console.log("TIME DIFFERENCE:", timeDiff);

  // -- CREATE THE NEW ROW VARIABLE WITH DATA -- //
  var newRow = $("<tr>").append(
    $("<th>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(moment(nextTrainTime).format("HH:mm")),
    $("<td>").text(Math.floor(timeDiff.asMinutes())),
    $("<td>").append('<button class="remove-button" info="' + childSnapshot.key + '" >X</button>')
  );
  // -- ADDS NEW ROW TO SCHEDULE -- //
  $("#trainScheduleData").append(newRow);

  // -- ERROR LOGGING -- //
}, function (errorObject) {
  console.log("ERRORS CODE:", errorObject.code);
});
// -- REMOVE BUTTON -- //
$(document).on("click", ".remove-button", function (event) {
  var key = $(this).attr("info");
  console.log(key);
  dataRef.ref().child(key).remove();
  location.reload();
})

