console.log("script loaded")


//-- INITIALIZE FIREBASE --//
var config = {
  apiKey: "AIzaSyB6Du2NXeN4CXlMrS2htGaYLtc6uPaoK6o",
  authDomain: "my-train-scheduler-project.firebaseapp.com",
  databaseURL: "https://my-train-scheduler-project.firebaseio.com",
  projectId: "my-train-scheduler-project",
  storageBucket: "my-train-scheduler-project.appspot.com",
  messagingSenderId: "916874916677"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

$(document).on("click", "#submit-button", function (event) {
  console.log("Function Trigger");
  event.preventDefault();

  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#train-destination").val().trim();
  var trainFrequency = $("#train-frequency").val().trim();
  var firstTrainTime = moment($("#first-train-time").val().trim(), "HH:mm").format("X");
  console.log("TRAIN NAME:", trainName, trainDestination, trainFrequency, firstTrainTime);
  dataRef.ref().push({
    trainName: trainName,
    trainDestination: trainDestination,
    trainFrequency: trainFrequency,
    firstTrainTime: firstTrainTime,
  });
  console.log("Sent Data to Firebase");
  $("#train-name").val("");
  $("#train-destination").val("");
  $("#train-frequency").val("");
  $("#first-train-time").val("");
});

dataRef.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  var trainName = childSnapshot.val().trainName;
  var trainDestination = childSnapshot.val().trainDestination;
  var trainFrequency = childSnapshot.val().trainFrequency;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  console.log(trainName, trainDestination, trainFrequency, firstTrainTime);
  var nextTrainTime = moment.unix(firstTrainTime);
  var currentTime = moment();
  console.log(nextTrainTime, currentTime);

  while (nextTrainTime.diff(currentTime) < 0) {
    nextTrainTime.add(trainFrequency, "m");
    console.log(nextTrainTime);
  }
  var timeDiff = moment.duration(nextTrainTime.diff(currentTime));
  console.log("TimeDiff:", timeDiff);

  var newRow = $("<tr>").append(
    $("<th>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(moment(nextTrainTime).format("HH:mm")),
    $("<td>").text(Math.floor(timeDiff.asMinutes())),
    $("<td>").append('<button class="remove-button" info="' + childSnapshot.key + '" >X</button>')
  );

  $("#trainScheduleData").append(newRow);


}, function (errorObject) {
  console.log("Errors code: " + errorObject.code);
});


//-- REMOVE BUTTON --//
$(document).on("click", ".remove-button", function (event) {
  var key = $(this).attr("info");
  console.log(key);
  dataRef.ref().child(key).remove();
  location.reload();

})

