const geoJSONFile = "https://raw.githubusercontent.com/matej-pavla/Google-Mapshttps://raw.githubusercontent.com/matej-pavla/Google-Maps-Examples/master/BoundariesExample/geojsons/us.states.geo.json";
const map_styling = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
let map;
let map_container = document.getElementById('map');

function initMap() {
	// initialize map object with disabled UI, zoom set to 5, and styles
	map = new google.maps.Map(map_container, {
		center: {lat: 38.787067, lng: -96.378726},
        disableDefaultUI: true,
		zoom: 5,
		minZoom: 5,
		maxZoom: 15,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        styles: map_styling
    });
	
	// adding menu element to the DOM via the map object
	// map.controls[google.maps.ControlPosition.TOP_CENTER].push(menu);
	
	// loading data layer with listeners for the GeoJSON data - see the code below
	initDataLayer();
};
	
let data_layer;
let info_window;
const dataStyleOptions = { fillColor: 'black', strokeWeight: 0, fillOpacity: 0.1 };
	
function initDataLayer() {
	// initialize data layer which contains the state boundaries with black bordering style - styling in line 32
	data_layer = new google.maps.Data({map: map});
	data_layer.setStyle(dataStyleOptions);

	// event listener for clicking on a singular U.S. state
	data_layer.addListener('click', function(event) { 
		console.log(event)
		let stateId = event.feature.i;
		let stateName = event.feature.i.NAME;
		realState = stateName;
		
		
		// closes existing modal when clicking on new state
		if(info_window){
			info_window.setMap(null);
		}

		// initializes modal for each state
		info_window = new google.maps.InfoWindow({
            size: new google.maps.Size(150,50),
			position: event.latLng, map: map
		});

		// modal on right with 93% transparency
		let designContainer = document.createElement('div');
		designContainer.style = 'background: rgba(0, 0, 0, 0.93); width: 33%; right: 0px; height: 100%; z-index: 1;';
		let designHistory = document.createElement('div');
		designHistory.style = 'background: rgba(0, 0, 0, 0.93); width: 33%; right: 0px; height: 100%; z-index: 1;';
		let designChange = document.createElement('div');

		
		// infowindow div containing each artist name
		
		let externalDiv = document.createElement('div');
		fetch('http://127.0.0.1:3000/api/v1/artists')
		.then(resp => resp.json())
		.then(function (artists) {
			artists.data.filter(function (artistObj) { 
				if (artistObj.attributes.state === `${realState}`) {
					console.log(artistObj)
					let artistDiv = document.createElement('div');
					artistDiv.innerHTML = `${artistObj.attributes.name}`
					externalDiv.append(artistDiv)
					designContainer.append(externalDiv)
					map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
					info_window.setContent(externalDiv);

					artistDiv.addEventListener('click', function () {
						console.log("I loaded the modal with the original artist's data!")
						designHistory.innerHTML = `
						<div class="artist-header">
						<img src="${artistObj.attributes["header_image"]}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
						mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
						
						<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
						
						<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artistObj.attributes.name}</font>
						</div>
						<div class="artist-body">
						<br>
						<div>
							<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Bio</font>
							<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 104%">${artistObj.attributes.bio}</font>
						</div>
						
						<font color="#FFFFFF" style="position: absolute; top: 37%; left: 3%; font-size: 200%">Albums</font>
						<div class="albums-container" style="position: absolute; top: 42%; left: 3%; width: 100%, height: 30%">
						<style>
							.album:hover img{ 
								transform:scale(1.05);
								transition: .1s ease;
							}
							
							.column:hover img{ 
								transform:scale(1.05);
								transition: .1s ease;
							}
						</style>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<div class="album" data-set="first-album"><img src="${artistObj.attributes.albums[0].image}" style="width: 90%; height: auto"/></div>
								<font color="#FFFFFF" style="font-size: 105%"><b>${artistObj.attributes.albums[0].name}</b></font><br>
								<font color="#1ED761" style="font-size: 100%">${artistObj.attributes.albums[0].year}</font><br>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
							<div class="album" data-set="second-album"><img src="${artistObj.attributes.albums[1].image}" style="width: 90%; height: auto"/></div>
								<font color="#FFFFFF" style="font-size: 105%"><b>${artistObj.attributes.albums[1].name}</b></font><br>
								<font color="#1ED761" style="font-size: 100%">${artistObj.attributes.albums[1].year}</font><br>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<div class="album" data-set="third-album"><img src="${artistObj.attributes.albums[2].image}" style="width: 90%; height: auto"/></div>
								<font color="#FFFFFF" style="font-size: 105%"><b>${artistObj.attributes.albums[2].name}</b></font><br>
								<font color="#1ED761" style="font-size: 100%">${artistObj.attributes.albums[2].year}</font><br>
							</div>
						</div>
		
						<font color="#FFFFFF" style="position: absolute; top: 69%; left: 3%; font-size: 200%">Related Artists</font>
						<div class="artists-container" style="position: absolute; top: 74%; left: 3%; width: 100%, height: 30%">
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<center><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/headers/taylor-swift.png" style="width: 90%; height: auto; border-radius: 50%;"/></center>
								<center><font color="#FFFFFF" style="font-size: 105%"><b>Taylor Swift</b></font></center>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<center><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/drdre-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/></center>
								<center><font color="#FFFFFF" style="font-size: 105%"><b>Dr. Dre</b></font></center>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<center><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/headers/beyonce.png" style="width: 90%; height: auto; border-radius: 50%;"/></center>
								<center><font color="#FFFFFF" style="font-size: 105%"><b>Beyonce</b></font></center>
							</div>
						</div>
						</div>
						`
		
						// info_window.setContent(artistDiv)
				
						let point = new google.maps.LatLng(`${artistObj.attributes["geo_lat"]}`,`${artistObj.attributes["geo_long"]}`);
						debugger
						map.setCenter(point);
						map.setZoom(11);
						map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
						map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designHistory);
						// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designContainer);
						info_window.close();


						let artistHeader = document.querySelector('.artist-header');
				let artistBody = document.querySelector('.artist-body');
				let albumContainer = document.querySelectorAll('.albums-container')[0];
				designHistory.addEventListener('click', function (event) {
					artistHeader.innerHTML = `
					<div class="artist-header">
						<img src="${artistObj.attributes["header_image"]}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
						mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
			
						<button id="back-button" style="position: absolute; top: 2%; right: 15.5%;">Back</button>
						<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
			
						<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artistObj.attributes.name}</font>
					</div>`

					if (event.target.parentNode.dataset.set === "first-album") {
						artistBody.innerHTML = `
						<br>
						<div>
							<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
						</div>
						<br>
						<center><iframe src="${artistObj.attributes.albums[0].playlist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
						`
						// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designContainer);
					} else if (event.target.parentNode.dataset.set === "second-album") {
						artistBody.innerHTML = `
						<br>
						<div>
							<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
						</div>
						<br>
						<center><iframe src="${artistObj.attributes.albums[1].playlist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
						`
					} else if (event.target.parentNode.dataset.set === "third-album") {
						artistBody.innerHTML = `
						<br>
						<div>
							<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
						</div>
						<br>
						<center><iframe src="${artistObj.attributes.albums[2].playlist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
						`
					}
				})

				designHistory.addEventListener('click', function (event) {
					
					let artistHeader = document.querySelector('.artist-header');
					let artistBody = document.querySelector('.artist-body')
					let albumContainer = document.querySelectorAll('.albums-container')[0];
					
					artistHeader.innerHTML = `
					<div class="artist-header">
					<img src="${artistObj.attributes["header_image"]}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
					mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
					
					<button id="back-button" style="position: absolute; top: 2%; right: 15.5%;">Back</button>
					<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
					
					<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artistObj.attributes.name}</font>
					</div>`
					if (event.target.id === "close-button") {
						console.log("I hit the close button!")
						map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
					let point = new google.maps.LatLng("38.787067", "-96.378726");
					map.setCenter(point);
					map.setZoom(5);
				} else if (event.target.id === "back-button") {
					console.log("I hit the back button!")
					designHistory.innerHTML = `<div class="artist-header">
					<img src="${artistObj.attributes["header_image"]}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
					mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
					
					<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
					
					<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artistObj.attributes.name}</font>
					</div>
					<div class="artist-body">
						<br>
						<div>
						<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Bio</font>
							<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 104%">${artistObj.attributes.bio}</font>
							</div>
							
						<font color="#FFFFFF" style="position: absolute; top: 37%; left: 3%; font-size: 200%">Albums</font>
						<div class="albums-container" style="position: absolute; top: 42%; left: 3%; width: 100%, height: 30%">
						<style>
							.album:hover img{ 
								transform:scale(1.05);
								transition: .1s ease;
							}
							
							.column:hover img{ 
								transform:scale(1.05);
								transition: .1s ease;
							}
						</style>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <div class="album" data-set="first-album"><img src="${artistObj.attributes.albums[0].image}" style="width: 90%; height: auto"/></div>
						  <font color="#FFFFFF" style="font-size: 105%"><b>${artistObj.attributes.albums[0].name}</b></font><br>
						  <font color="#1ED761" style="font-size: 100%">${artistObj.attributes.albums[0].year}</font><br>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <div class="album" data-set="second-album"><img src="${artistObj.attributes.albums[1].image}" style="width: 90%; height: auto"/></div>
						  <font color="#FFFFFF" style="font-size: 105%"><b>${artistObj.attributes.albums[1].name}</b></font><br>
						  <font color="#1ED761" style="font-size: 100%">${artistObj.attributes.albums[1].year}</font><br>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <div class="album" data-set="third-album"><img src="${artistObj.attributes.albums[2].image}" style="width: 90%; height: auto"/></div>
						  <font color="#FFFFFF" style="font-size: 105%"><b>${artistObj.attributes.albums[2].name}</b></font><br>
						  <font color="#1ED761" style="font-size: 100%">${artistObj.attributes.albums[2].year}</font><br>
						  </div>
						  </div>
		
						  <font color="#FFFFFF" style="position: absolute; top: 69%; left: 3%; font-size: 200%">Related Artists</font>
						  <div class="artists-container" style="position: absolute; top: 74%; left: 3%; width: 100%, height: 30%">
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/headers/taylor-swift.png" style="width: 90%; height: auto; border-radius: 50%;"/>
						  <div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>Taylor Swift</b></font></center></div>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/drdre-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
						  <div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>Dr. Dre</b></font></center></div>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/headers/beyonce.png" style="width: 90%; height: auto; border-radius: 50%;"/>
								<div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>Beyonce</b></font></center></div>
								</div>
								</div>
								</div>` }
							
							//insert listeners and album code here
							else if (event.target.parentNode.dataset.set === "first-album") {
								console.log("I clicked the first album - original Snoop!")
								
								artistBody.innerHTML = `
								<br>
								<div>
								<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
								<font color="#1ED761" style="position: absolute; top: 23%; left: 3%; font-size: 190%">${artistObj.attributes.albums[0].name} - ${artistObj.attributes.albums[0].year}</font>
								</div>
								<br>
								<center><iframe src="${artistObj.attributes.albums[0].playlist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
								`
								// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designContainer);
							} else if (event.target.parentNode.dataset.set === "second-album") {
								console.log("I clicked the second album - original Snoop!")
						artistBody.innerHTML = `
						<br>
						<div>
						<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
						<font color="#1ED761" style="position: absolute; top: 23%; left: 3%; font-size: 190%">${artistObj.attributes.albums[1].name} - ${artistObj.attributes.albums[1].year}</font>
						</div>
						<br>
						<center><iframe src="${artistObj.attributes.albums[1].playlist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
						`
					} else if (event.target.parentNode.dataset.set === "third-album") {
						console.log("I clicked the third album - original Snoop!")
						artistBody.innerHTML = `
						<br>
						<div>
						<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
						<font color="#1ED761" style="position: absolute; top: 23%; left: 3%; font-size: 190%">${artistObj.attributes.albums[2].name} - ${artistObj.attributes.albums[2].year}</font>
						</div>
						<br>
						<center><iframe src="${artistObj.attributes.albums[2].playlist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
						`
					}
							
							
				})

						})

				} 
			})
		})

		// iterate through each artist to display artist information
		artists[event.feature.h.NAME].forEach(function (artist) {
			
			// // create div to contain artist name for each artist in object
			// let artistDiv = document.createElement('div');
			// artistDiv.innerHTML = `${artist.artist}`

			// // append each artist to external div
			// externalDiv.append(artistDiv)

			// // append each external div to the design container modal
			// designContainer.append(externalDiv);

			// // clear out modal on the right side of the page each time a new artist modal is loaded
			// map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
			// // add artist div with each artist name to the info window modal
			// info_window.setContent(externalDiv);

			// event listener for artistDiv
			artistDiv.addEventListener('click', function () {
				// console.log("I loaded the modal with the original artist's data!")
				// designHistory.innerHTML = `
				// <div class="artist-header">
				// <img src="${artist.image}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
				// mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
				
				// <button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
				
				// <font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artist.artist}</font>
				// </div>
				// <div class="artist-body">
				// <br>
				// <div>
				// 	<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Bio</font>
				// 	<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 104%">Snoop Dogg, byname of Cordozar Calvin Broadus, Jr., also called Snoop Doggy Dogg and Snoop Lion, (born October 20, 1971, Long Beach, California, U.S.), American rapper and songwriter who became one of the best-known figures in gangsta rap in the 1990s and was for many the epitome of West Coast hip-hop culture.</font>
				// </div>
				
				// <font color="#FFFFFF" style="position: absolute; top: 37%; left: 3%; font-size: 200%">Albums</font>
				// <div class="albums-container" style="position: absolute; top: 42%; left: 3%; width: 100%, height: 30%">
				// <style>
				// 	.album:hover img{ 
				// 		transform:scale(1.05);
				// 		transition: .1s ease;
				// 	}
					
				// 	.column:hover img{ 
				// 		transform:scale(1.05);
				// 		transition: .1s ease;
				// 	}
				// </style>
				// 	<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
				// 		<div class="album" data-set="first-album"><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/albums/snoop-doggumentary.png" style="width: 90%; height: auto"/></div>
				// 		<font color="#FFFFFF" style="font-size: 105%"><b>Doggumentary</b></font><br>
				// 		<font color="#1ED761" style="font-size: 100%">2011</font><br>
				// 	</div>
				// 	<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
				// 	<div class="album" data-set="second-album"><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/albums/snoop-doggfather.png" style="width: 90%; height: auto"/></div>
				// 		<font color="#FFFFFF" style="font-size: 105%"><b>Tha Doggfather</b></font><br>
				// 		<font color="#1ED761" style="font-size: 100%">1996</font><br>
				// 	</div>
				// 	<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
				// 		<div class="album" data-set="third-album"><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/albums/snoop-doggy.png" style="width: 90%; height: auto"/></div>
				// 		<font color="#FFFFFF" style="font-size: 105%"><b>Doggystyle</b></font><br>
				// 		<font color="#1ED761" style="font-size: 100%">1993</font><br>
				// 	</div>
				// </div>

				// <font color="#FFFFFF" style="position: absolute; top: 69%; left: 3%; font-size: 200%">Related Artists</font>
				// <div class="artists-container" style="position: absolute; top: 74%; left: 3%; width: 100%, height: 30%">
				// 	<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
				// 		<img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/2pac-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
				// 		<center><font color="#FFFFFF" style="font-size: 105%"><b>2pac</b></font></center>
				// 	</div>
				// 	<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
				// 		<img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/drdre-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
				// 		<center><font color="#FFFFFF" style="font-size: 105%"><b>Dr. Dre</b></font></center>
				// 	</div>
				// 	<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
				// 		<img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/icecube-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
				// 		<center><font color="#FFFFFF" style="font-size: 105%"><b>Ice Cube</b></font></center>
				// 	</div>
				// </div>
				// </div>
				// `

				// info_window.setContent(artistDiv)
		
				// let point = new google.maps.LatLng("34.04828545050998","-118.19351253769025");
				// map.setCenter(point);
				// map.setZoom(13);
				// map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
				// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designHistory);
				// // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designContainer);
				// info_window.close();
				
				// let artistHeader = document.querySelector('.artist-header');
				// let artistBody = document.querySelector('.artist-body');
				// let albumContainer = document.querySelectorAll('.albums-container')[0];
				// designHistory.addEventListener('click', function (event) {
				// 	artistHeader.innerHTML = `
				// 	<div class="artist-header">
				// 		<img src="${artist.image}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
				// 		mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
			
				// 		<button id="back-button" style="position: absolute; top: 2%; right: 15.5%;">Back</button>
				// 		<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
			
				// 		<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artist.artist}</font>
				// 	</div>`

				// 	if (event.target.parentNode.dataset.set === "first-album") {
				// 		artistBody.innerHTML = `
				// 		<br>
				// 		<div>
				// 			<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
				// 		</div>
				// 		<br>
				// 		<center><iframe src="https://open.spotify.com/embed/album/4x53rdOiC4Zkb3bbqw9FyM" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
				// 		`
				// 		// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designContainer);
				// 	} else if (event.target.parentNode.dataset.set === "second-album") {
				// 		artistBody.innerHTML = `
				// 		<br>
				// 		<div>
				// 			<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
				// 		</div>
				// 		<br>
				// 		<center><iframe src="https://open.spotify.com/embed/album/3ipgG1hcNGJYo0hdJvwPTP" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
				// 		`
				// 	} else if (event.target.parentNode.dataset.set === "third-album") {
				// 		artistBody.innerHTML = `
				// 		<br>
				// 		<div>
				// 			<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
				// 		</div>
				// 		<br>
				// 		<center><iframe src="https://open.spotify.com/embed/album/7f9KDGqY7X2VLBM5aA66KM" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
				// 		`
				// 	}
				// })

				// close modal and re-orient the page to main map
				designHistory.addEventListener('click', function (event) {
					
					let artistHeader = document.querySelector('.artist-header');
					let artistBody = document.querySelector('.artist-body')
					let albumContainer = document.querySelectorAll('.albums-container')[0];
					
					artistHeader.innerHTML = `
					<div class="artist-header">
					<img src="${artist.image}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
					mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
					
					<button id="back-button" style="position: absolute; top: 2%; right: 15.5%;">Back</button>
					<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
					
					<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artist.artist}</font>
					</div>`
					if (event.target.id === "close-button") {
						console.log("I hit the close button!")
						map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
					let point = new google.maps.LatLng("38.787067", "-96.378726");
					map.setCenter(point);
					map.setZoom(5);
				} else if (event.target.id === "back-button") {
					console.log("I hit the back button!")
					designHistory.innerHTML = `<div class="artist-header">
					<img src="${artist.image}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
					mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
					
					<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
					
					<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${artist.artist}</font>
					</div>
					<div class="artist-body">
						<br>
						<div>
						<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Bio</font>
							<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 104%">Snoop Dogg, byname of Cordozar Calvin Broadus, Jr., also called Snoop Doggy Dogg and Snoop Lion, (born October 20, 1971, Long Beach, California, U.S.), American rapper and songwriter who became one of the best-known figures in gangsta rap in the 1990s and was for many the epitome of West Coast hip-hop culture.</font>
							</div>
							
						<font color="#FFFFFF" style="position: absolute; top: 37%; left: 3%; font-size: 200%">Albums</font>
						<div class="albums-container" style="position: absolute; top: 42%; left: 3%; width: 100%, height: 30%">
						<style>
						.album:hover img{ 
							transform:scale(1.05);
						  }
						  </style>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <div class="album" data-set="first-album"><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/albums/snoop-doggumentary.png" style="width: 90%; height: auto"/></div>
						  <font color="#FFFFFF" style="font-size: 105%"><b>Doggumentary</b></font><br>
						  <font color="#1ED761" style="font-size: 100%">2011</font><br>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <div class="album" data-set="second-album"><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/albums/snoop-doggfather.png" style="width: 90%; height: auto"/></div>
						  <font color="#FFFFFF" style="font-size: 105%"><b>Tha Doggfather</b></font><br>
						  <font color="#1ED761" style="font-size: 100%">1996</font><br>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <div class="album" data-set="third-album"><img src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/albums/snoop-doggy.png" style="width: 90%; height: auto"/></div>
						  <font color="#FFFFFF" style="font-size: 105%"><b>Doggystyle</b></font><br>
						  <font color="#1ED761" style="font-size: 100%">1993</font><br>
						  </div>
						  </div>
		
						  <font color="#FFFFFF" style="position: absolute; top: 69%; left: 3%; font-size: 200%">Related Artists</font>
						  <div class="artists-container" style="position: absolute; top: 74%; left: 3%; width: 100%, height: 30%">
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/2pac-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
						  <div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>2pac</b></font></center></div>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/drdre-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
						  <div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>Dr. Dre</b></font></center></div>
						  </div>
						  <div class="column" style="width: 33.33%; height: 33.33%; float: left;">
						  <img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/icecube-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
								<div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>Ice Cube</b></font></center></div>
								</div>
								</div>
								</div>`
							}
							
							else if (event.target.parentNode.dataset.set === "first-album") {
								console.log("I clicked the first album - original Snoop!")
								
								artistBody.innerHTML = `
								<br>
								<div>
								<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
								</div>
								<br>
								<center><iframe src="https://open.spotify.com/embed/album/4x53rdOiC4Zkb3bbqw9FyM" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
								`
								// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(designContainer);
							} else if (event.target.parentNode.dataset.set === "second-album") {
								console.log("I clicked the second album - original Snoop!")
						debugger
						artistBody.innerHTML = `
						<br>
						<div>
						<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
						</div>
						<br>
						<center><iframe src="https://open.spotify.com/embed/album/3ipgG1hcNGJYo0hdJvwPTP" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
						`
					} else if (event.target.parentNode.dataset.set === "third-album") {
						console.log("I clicked the third album - original Snoop!")
						artistBody.innerHTML = `
						<br>
						<div>
						<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
						</div>
						<br>
						<center><iframe src="https://open.spotify.com/embed/album/7f9KDGqY7X2VLBM5aA66KM" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
						`
					} else if (event.target.className === "artist-name") {
						let filteredArtist = artists[`${realState}`].filter(function(artist) { return artist.artist === `${event.target.parentNode.innerText}` })[0];
						console.log(`I just changed designHistory's innerHTML to ${filteredArtist["artist"]}'s information!`)
						designHistory.innerHTML = `<div class="artist-header-new">
						<img src="${filteredArtist["image"]}" style="width: 100%; max-height: 50%; -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
						mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));">
						
						<button id="close-button" style="position: absolute; top: 2%; right: 3%;">Close</button>
						
						<font color="#FFFFFF" style="position: absolute; top: 1%; left: 3%; font-size: 370%">${filteredArtist["artist"]}</font>
						</div>
						<div class="artist-body-new">
						<br>
						<div>
							<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Bio</font>
							<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 104%">${filteredArtist["bio"]}</font>
						</div>
						
						<font color="#FFFFFF" style="position: absolute; top: 37%; left: 3%; font-size: 200%">Albums</font>
						<div class="albums-container-new" style="position: absolute; top: 42%; left: 3%; width: 100%, height: 30%">
						<style>
							.album:hover img{ 
							transform:scale(1.05);
							transition: .1s ease;
							}
					
							.column:hover img{ 
							transform:scale(1.05);
							transition: .1s ease;
							}
						</style>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<div class="album-new" data-set="first-album-new"><img src="${filteredArtist["albums"][0]["image"]}" style="width: 90%; height: auto;"/></div>
								<font color="#FFFFFF" style="font-size: 105%"><b>${filteredArtist["albums"][0]["name"]}</b></font><br>
								<font color="#1ED761" style="font-size: 100%">${filteredArtist["albums"][0]["year"]}</font><br>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
							<div class="album-new" data-set="second-album-new"><img src="${filteredArtist["albums"][1]["image"]}" style="width: 90%; height: auto"/></div>
								<font color="#FFFFFF" style="font-size: 105%"><b>${filteredArtist["albums"][1]["name"]}</b></font><br>
								<font color="#1ED761" style="font-size: 100%">${filteredArtist["albums"][1]["year"]}</font><br>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<div class="album-new" data-set="third-album-new"><img src="${filteredArtist["albums"][2]["image"]}" style="width: 90%; height: auto"/></div>
								<font color="#FFFFFF" style="font-size: 105%"><b>${filteredArtist["albums"][2]["name"]}</b></font><br>
								<font color="#1ED761" style="font-size: 100%">${filteredArtist["albums"][2]["year"]}</font><br>
							</div>
						</div>
		
						<font color="#FFFFFF" style="position: absolute; top: 69%; left: 3%; font-size: 200%">Related Artists</font>
						<div class="artists-container" style="position: absolute; top: 74%; left: 3%; width: 100%, height: 30%">
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/2pac-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
								<div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>2pac</b></font></center></div>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/drdre-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
								<div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>Dr. Dre</b></font></center></div>
							</div>
							<div class="column" style="width: 33.33%; height: 33.33%; float: left;">
								<img class="artist-name" src="/Users/hectorpolanco/Development/mod_three_project/geomusicology-api/app/assets/images/artists/icecube-headshot.png" style="width: 90%; height: auto; border-radius: 50%;"/>
								<div class="artist-name"><center><font color="#FFFFFF" style="font-size: 105%"><b>Ice Cube</b></font></center></div>
							</div>
						</div>
						</div>`
						let albumContainerNew = document.querySelector('.albums-container-new');
						let artistBodyNew = document.querySelector('.artist-body-new');
						albumContainerNew.addEventListener('click', function (event) {
							console.log(event)
							if (event.target.parentNode.dataset.set === "first-album-new") {
								artistBodyNew.innerHTML = `
								<br>
								<div>
								<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
								<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 170%">${filteredArtist["albums"][1]["name"]} - ${filteredArtist["albums"][1]["year"]}</font>
								</div>
								<div style="position: absolute; top: 33%; left: 0%; right: 0%; width: 100%, height: 30%">
								<br>
								<center><iframe src="${filteredArtist["albums"][0]["playlist"]}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
								</div>
								`
							} else if (event.target.parentNode.dataset.set === "second-album-new") {
								artistBodyNew.innerHTML = `
								<br>
								<div>
								<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
								<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 170%">${filteredArtist["albums"][1]["name"]} - ${filteredArtist["albums"][1]["year"]}</font>
								</div>
								<div style="position: absolute; top: 33%; left: 0%; right: 0%; width: 100%, height: 30%">
								<br>
								<iframe src="${filteredArtist["albums"][1]["playlist"]}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
								</div>
								`
							} else if (event.target.parentNode.dataset.set === "third-album-new") {
								artistBodyNew.innerHTML = `
								<br>
								<div>
								<font color="#FFFFFF" style="position: absolute; top: 18%; left: 3%; font-size: 200%">Album</font>
								<font color="#FFFFFF" style="position: absolute; top: 23%; left: 3%; font-size: 170%">${filteredArtist["albums"][1]["name"]} - ${filteredArtist["albums"][1]["year"]}</font>
								</div>
								<div style="position: absolute; top: 33%; left: 0%; right: 0%; width: 100%, height: 30%">
								<br>
								<center><iframe src="${filteredArtist["albums"][2]["playlist"]}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></center>
								</div>
								`
							}

							console.log("I clicked on a new album!")
						})
					}
				})

			})

		})
	});

	data_layer.addListener('mouseover', function(event) {
		data_layer.overrideStyle(event.feature, { strokeWeight: 1, strokeColor: '#000000', fillColor: '#1ED761', fillOpacity: .3 });
	});

	data_layer.addListener('mouseout', function(event) {
		data_layer.overrideStyle(event.feature, { strokeWeight: 0, strokeColor: '', fillColor: 'black', fillOpacity: .1 });
	});
	
	initGeoJSON();
}

// fetch GeoJSON file with coordinates to make polygons in the data layer
function initGeoJSON() {
	fetch(geoJSONFile)
	.then(resp => resp.json())
	.then(data => {
		data.features.forEach(
			function (usState, i) {
				let stateId = ++i;
				usState.properties.stateId = stateId;
				data_layer.addGeoJson(usState, { idPropertyName: 'stateId' });
			}
		)
	})
}