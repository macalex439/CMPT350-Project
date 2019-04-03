function initAutocomplete() {

  var gyms = [{lat: 52.1129549, lng: -106.5946763},
  {lat: 52.11585299999999, lng: -106.62650259999998},
  {lat: 52.1289689, lng: -106.66871279999998},
  {lat: 52.1303856, lng: -106.72443599999997},
  {lat: 52.1716408, lng: -106.63362840000002},
  {lat: 52.0848088, lng: -106.6422617},
  {lat: 52.1299588, lng: -106.593252},
  {lat: 52.088708, lng: -106.65985699999999},
  {lat: 52.0854337, lng: -106.64812269999999},
  {lat: 52.1502592, lng: -106.57001389999999},
  {lat: 52.14470799999999, lng: -106.66574400000002},
  {lat: 52.1286259, lng: -106.75795060000002},
  {lat: 52.0850733, lng: -106.62103239999999},
  {lat: 52.140942, lng:  -106.59911590000002},
  {lat: 52.133194, lng:  -106.59587699999997},
  {lat: 52.09795500000001, lng: -106.56471859999999},
  {lat: 52.1262742, lng: -106.67054129999997},
  {lat: 52.145036, lng: -106.66264209999997},
  {lat: 52.194469, lng: -106.64252690000001},
  {lat: 52.09042299999999, lng: -106.57079099999999}
  ];


  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 52.13, lng: -106.67},
    zoom: 12,
    mapTypeId: 'roadmap',
    url: "localhost3000/home.html"
  });

  var i;
  var markers = [];
  var infoWindows = [];
  for (i = 0; i < gyms.length; i++) {
    markers.push(new google.maps.Marker({
      position: gyms[i],
      map: map,
      url: "www.google.ca"
    }));
    //infoWindows.push(new google.maps.InfoWindow({content: "Local Gym"}));
    //infoWindows[i].open(map, markers[i]);
  }
  //var input = "gyms near Saskatoon, SK, Canada";
  // Create the search box and link it to the UI element.

  var  input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  //markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    infoWindows = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        //icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      infoWindows.push(new google.maps.InfoWindow({
        content: place.name
      }));

      for (i = 0; i < infoWindows.length; i++) {
        infoWindows[i].open(map, markers[i]);
        map.addListener(markers[i], 'click', function(){
          window.location.href = this.url;
        }); //Try to add url to the markers but does not seem to work
      }

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
