/*OAKLAND*/
        mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
       
        var COLORS = ['#cfe8f3', '#cfe8f3','#1696d2', '#1696d2', '#0a4c6a', '#0a4c6a'];
        var BREAKS = {
                "G1A2012.x": [-0.49, -0.024, -0.024, 0.1301, 0.1301, 0.203],
                            // [-0.49, -0.024, -0.023, 0.1301, 0.1302, 0.203],
                "G1B2012.x": [-0.57, -0.049, -0.049, 0.1351, 0.1351, 0.2]
                            //[-0.57, -0.049, -0.048, 0.1351, 0.1352, 0.2]
            };
        var bounds = [
            [-122.652686,37.610081], // Southwest coordinates
            [-121.759913,38.115431]  // Northeast coordinates
        ];
        var BASE='G1A2012.x';
        var FILTERUSE;
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v8',
            center: [-122.2511,37.800364],
            zoom: 10,
            maxBounds: bounds
        });
        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.Navigation());
        //add some point data and style it
        map.on('load', function () {
            map.addSource("census_tracts", {
                "type": "geojson",
                "data": 'data/oak_data/oakland.geojson'
            });
            
             map.addLayer({
                "id": "tract-fill",
                "type": "fill",
                "source": "census_tracts",
                "paint": {
                    "fill-color": {
                        property: 'G1A2012.x',
                        stops: [
                    [BREAKS[BASE][0], COLORS[0]],
                    [BREAKS[BASE][1], COLORS[1]],
                    [BREAKS[BASE][2], COLORS[2]],
                    [BREAKS[BASE][3], COLORS[3]],
                    [BREAKS[BASE][4], COLORS[4]],
                    [BREAKS[BASE][5], COLORS[5]]
                  
                    ]},
                    "fill-opacity": 0.85,
                    "fill-outline-color": "#ffffff"
                }
            }); 

           map.addLayer({
                "id": "tract-hover",
                "type": "fill",
                "source": "census_tracts",
                "layout": {},
                "paint": {
                    "fill-color": "#fdbf11",
                    "fill-opacity": 1
                },
                "filter": ["==", "GEOID10", ""]
            });



            map.addLayer({
                "id": "tract_line",
                "type": "line",
                "source": "census_tracts",
                "paint": {
                    "line-color": "#ec008b",
                    "line-opacity": 0.8,
                    "line-width": 1.5
                },
                "filter": ["==", "HHom11", 1]
               
            }); 

        });

        map.on("mousemove", function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ["tract-fill"]
            });
            

            if(IS_MOBILE){
                if (features.length) {
                    //show name and value in sidebar
                   /* document.getElementById('tooltip-name').innerHTML = "Census Tract GEOID" + features[0].properties.GEOID;*/
                    document.getElementById('tooltip-mobile').innerHTML = "From 2011 to 2012, the employment growth rate was " + Math.round(features[0].properties[BASE]*100000)/1000 + "%" + ".";
                    //for troubleshooting - show complete features info
                    //document.getElementById('tooltip').innerHTML = JSON.stringify(features, null, 2);
                } else {
                    //if not hovering over a feature set tooltip to empty
                    document.getElementById('tooltip-name-mobile').innerHTML = "";
                    document.getElementById('tooltip-mobile').innerHTML = "";
                }
            }else{
                if (features.length) {
                    //show name and value in sidebar
                   /* document.getElementById('tooltip-name').innerHTML = "Census Tract GEOID" + features[0].properties.GEOID;*/
                    document.getElementById('tooltip').innerHTML = "From 2011 to 2012, the employment growth rate was " + Math.round(features[0].properties[BASE]*100000)/1000 + "%" + ".";
                    //for troubleshooting - show complete features info
                    //document.getElementById('tooltip').innerHTML = JSON.stringify(features, null, 2);
                } else {

                    //if not hovering over a feature set tooltip to empty
                    document.getElementById('tooltip-name').innerHTML = "";
                    document.getElementById('tooltip').innerHTML = "";
                }
            }

             map.on("mousemove", function(e) {
                var features = map.queryRenderedFeatures(e.point, { layers: ["tract-fill"] });
                if (features.length) {
                    map.setFilter("tract-hover", ["==", "GEOID10", features[0].properties.GEOID10]);
                } else {
                    map.setFilter("tract-hover", ["==", "GEOID10", ""]);
                }
            });

        // Reset the route-hover layer's filter when the mouse leaves the map
            map.on("mouseout", function() {
                map.setFilter("tract-hover", ["==", "GEOID10", ""]);
            });
        });

 
     $('#base-btns label').click(function () {
        BASE = $(this).attr("id");

        map.setPaintProperty('tract-fill', 'fill-color', {
            property: BASE,
            stops: [
                    [BREAKS[BASE][0], COLORS[0]],
                    [BREAKS[BASE][1], COLORS[1]],
                    [BREAKS[BASE][2], COLORS[2]],
                    [BREAKS[BASE][3], COLORS[3]],
                    [BREAKS[BASE][4], COLORS[4]],
                    [BREAKS[BASE][5], COLORS[5]]
          
                    ]
        });
    })
  
 
  /*  $('#map-btns label').click(function () {
        OUTLINE = $(this).attr("id");
        map.setFilter('tract_line', [">",OUTLINE, 2])

    }) */

var IS_MOBILE = $("#isMobile").css("display") == "block"
window.onresize = function(){
    IS_MOBILE = $("#isMobile").css("display") == "block"
}

 var pymChild = new pym.Child()

 