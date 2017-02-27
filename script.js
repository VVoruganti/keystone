
var firebaseJSON;
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBQ9HTZdgqYPLimA5NMdAtSQ6vEJQ-tkLI",
  authDomain: "keystone-reality.firebaseapp.com",
  databaseURL: "https://keystone-reality.firebaseio.com",
  storageBucket: "keystone-reality.appspot.com",
  messagingSenderId: "189134220951"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();


// in order to use a variable as the json key wrap it in brackets ex. [roomArray[i][3]]

// function initialWrite() {
//   for(var i =0 ; i < roomArray.length ; i++) {
//     var unit = roomArray[i][2]
//     database.ref("/" + roomArray[i][0] + "/" + roomArray[i][1] + "/" + roomArray[i][2]).update({
//       [roomArray[i][3]]: {
//         "marketRent":roomArray[i][4],
//         "tenantName":roomArray[i][6],
//         "Gender":roomArray[i][7],
//         "classYear":roomArray[i][8],
//         "major":roomArray[i][9],
//         "monthlyRent":roomArray[i][10]
//       }
//     });
// }
// }

//data.ref('/properties/'' + roomArray[0][0] + '/' + roomArray[0][1] + '/' + roomArray[0][2]).update({'tenant-name':'vacant'});

//initialWrite()

/*function dataTest(data) {
  console.log(data)
}
dataTest(database.ref().once('value', function(snapshot){return snapshot.val()}));*/


function fireCalculateVariables(year) {
  var usedSpaces = 0;
  var totalSize = 0;
  var unusedSpaces = totalSize - usedSpaces;
  var marketRent = 0;
  var actualRent = 0;
  database.ref("/" + year + "/").on('value', function(snapshot){
    console.log("Why")
    firebaseJSON = snapshot.val()
    console.log(firebaseJSON);
    for(var a in firebaseJSON) {
      if(firebaseJSON.hasOwnProperty(a)) {
        for(var b in firebaseJSON[a]) {
          if(firebaseJSON[a].hasOwnProperty(b)) {
            for(var c in firebaseJSON[a][b]) {
              if(firebaseJSON[a][b].hasOwnProperty(c)) {
                totalSize++;
                marketRent += parseInt(firebaseJSON[a][b][c]["marketRent"]);
                if(firebaseJSON[a][b][c]["tenantName"] != "") {
                  usedSpaces++;
                  actualRent += parseInt(firebaseJSON[a][b][c]["monthlyRent"]);
                }
                unusedSpaces = totalSize - usedSpaces;
              }
              // console.log(marketRent);
            }
          }
        }
      }
    }
    var values = [marketRent, actualRent, usedSpaces, unusedSpaces];
    console.log(values);
    // console.log(values);
    updateCharts(values);

      });
}


function switchVariables(value) {
  fireCalculateVariables(prompt("What year? 2016-17 or 2016-18"));
}

function getDataTableData(year){
  database.ref("/"+ year + "/").once('value', function(snapshot) {
    var column1 = [];
    var column2 = [];
    var column3 = [];
    var column4 = [];
    var firebaseJSON = snapshot.val();
    for(var i in firebaseJSON) {
       if(firebaseJSON.hasOwnProperty(i)){
       for(var j in firebaseJSON[i]) {
         console.log(Object.keys(firebaseJSON["Greystone Court Aprt"].length));
      }
    }
  }
})
}
//getDataTableData("2016-17");

function data() {
  console.log("start");
  var name = $("#Name").val();
  var classYear = $("#Class-Year").val();
  var major = $("#Major").val();
  var academicYear = $("#Academic-Year").val();
  var gender = $("#Gender").val();
  var propertyName = $("#Property-Name").val();
  var apartmentNum = $("#Apartment-Number").val();
  var apartmentSpace = $("#Apartment-Space").val();
  var monthlyRent = $("#Monthly-Rent").val();

  database.ref("/" + academicYear + "/" + propertyName + "/" + apartmentNum + "/" + apartmentSpace + "/").once('value',function(snapshot) {
    var snapshotData = snapshot.val();
    if(snapshotData.tenantName == "") {
      database.ref("/" + academicYear + "/" + propertyName + "/" + apartmentNum + "/" + apartmentSpace + "/").update({
        "tenantName":name,
        "monthlyRent":monthlyRent,
        "Gender":gender,
        "classYear":classYear,
        "major":major
      });
      alert("This is your room now, enjoy");
    }
    else if(snapshot.tenantName != "") {
      alert("This room is taken");
    }
  })

fireCalculateVariables("2016-17");
//  updateCharts(calculateVariables());
}

function updateCharts(values) {

  $("#myChart").replaceWith('<canvas id="myChart" width="500" height="500"></canvas>');
  $("#pieChart").replaceWith('<canvas id="pieChart" width="500" height="500"></canvas>');


  var ctx = $("#myChart").get(0).getContext("2d");
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Maximum Utilization", "Current Utilization"],
          datasets: [{
              label: '$',
              data: [values[0], values[1]],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',

              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });

  var ptx = $("#pieChart").get(0).getContext("2d");
  var pieChart = new Chart(ptx, {
    type:'pie',
    data:{
      labels: ["Occupied Rooms","Unoccupied Rooms"],
      datasets: [
        {
          data:[values[2],values[3]],
          backgroundColor: ["#FF6384","#36A2EB",],
        hoverBackgroundColor: ["#FF6384","#36A2EB"]
      }]
    }  });

}

function restrictProperties(el) {
  $(document).ready(function() {
    var key = $(el).val()
    console.log($(el).val())
    database.ref("/"+ key + "/").once('value',function(snapshot) {
      var data = snapshot.val()
      var properties = Object.keys(data);
      console.log(properties);
      for(var i = 0; i < properties.length; i++){
        $("#Property-Name").append("<option>"+ properties[i] +"<option>");
        console.log(String(properties[i]));
      }
    });
  });
}

function restrictApartmentNumber(el){
  $(document).ready(function(){
    var key = $(el).val()
    database.ref("/" + $("#Academic-Year").val() + "/" + key + "/").once('value',function(snapshot) {
      var data = snapshot.val();
      var properties = Object.keys(data);
      for(var i = 0; i < properties.length;i++) {
        $("#Apartment-Number").append("<option>"+ properties[i] + "<option>");
        console.log(String(properties[i]));
      }
    })
  })
}

function restrictApartmentSpace(el){
  $(document).ready(function(){
    var key = $(el).val()
    database.ref("/" + $("#Academic-Year").val() + "/" + $("#Property-Name").val() + "/" + key + "/").once('value',function(snapshot) {
      var data = snapshot.val();
      var properties = Object.keys(data);
      for(var i = 0; i < properties.length;i++) {
        $("#Apartment-Space").append("<option>"+ properties[i] + "<option>");
        console.log(String(properties[i]));
      }
    })
  })
}

function changeTable(){
  $(".div-table-2016-2017").toggleClass("hidden");
  $(".div-table-2017-2018").toggleClass("hidden");
}

$(document).ready(function() {

  $( "#Lease-Start" ).datepicker();
  $("#Lease-End").datepicker();

  fireCalculateVariables("2016-17");

  $(".table-2016-17").dataTable(
    {
        "scrollY":        "700px",
        "scrollCollapse": true,
        "paging":         false,
        "autoWidth":true
    }
  );
  $(".table-2017-18").dataTable(
    {
        "scrollY":        "700px",
        "scrollCollapse": true,
        "paging":         false,
        "autoWidth":true
    }
  );

console.log($("#switch-1").is(":checked"));

});
