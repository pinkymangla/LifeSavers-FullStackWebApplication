
//LIKE IN PREVIOUS SHOW PAGE MAP
let lolo=[-103.5917, 40.6699];
let zoom=3;
if(activeUser && activeUser.features && activeUser.features.geometry && activeUser.features.geometry.coordinates){
    lolo=activeUser.features.geometry.coordinates
    zoom=5
}
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: lolo,
    zoom: zoom

});

// console.log(campgrounds)
//An event that runs on map load on client side
map.on('load', () => {
        //console.log("Loaded")
        //you would have seen this on dev tools console(client side)

    //to add the source of data
    map.addSource('campgrounds', {
        type: 'geojson',
        //this has to be an object containing features and then any array of objects having geometry attribute
        //also for other info you need you need to use properties attribute in each features object
        //we use virtual property on campground schema for this here
        //that's it look at index.ejs for code for this

        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    map.addSource('users', {
        type: 'geojson',
        //this has to be an object containing features and then any array of objects having geometry attribute
        //also for other info you need you need to use properties attribute in each features object
        //we use virtual property on campground schema for this here
        //that's it look at index.ejs for code for this

        data: users,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    
    map.addLayer({
        //for circles representing the clusters
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        //should be at least two or should not be standalone point i.e unclustered point
        filter: ['has', 'point_count'],
        paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#00BCD4',
                            10,
                            '#2196F3',
                            30,
                            '#3F51B5'
                        ],
        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            15,
                            10,
                            20,
                            30,
                            25
                        ]
        }
    });
    map.addLayer({
        //for circles representing the clusters
        id: 'clusters_users',
        type: 'circle',
        source: 'users',
        //should be at least two or should not be standalone point i.e unclustered point
        filter: ['has', 'point_count'],
        paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#ff0000',
                            10,
                            '#ff0000',
                            30,
                            '#ff0000'
                        ],
        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            15,
                            10,
                            20,
                            30,
                            25
                        ]
        }
    });

    
    map.addLayer({
        //Text on clusters i.e the display of clustered numbers
        id: 'cluster-count',
        //just text==> symbol
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': ['get', 'point_count_abbreviated'] ,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
    });
    map.addLayer({
        //Text on clusters i.e the display of clustered numbers
        id: 'cluster-count-users',
        //just text==> symbol
        type: 'symbol',
        source: 'users',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': ['get', 'point_count_abbreviated'] ,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
    });
    
    map.addLayer({
        //For an Unclustered point i.e stand alone points 
        //because without this you will only see clusters that dissapear when you zoom in
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        // when there is no point count i.e unclustered
        filter: ['!', ['has', 'point_count']],
        paint: {
        'circle-color': '#11b4da',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        //white stroke
        'circle-stroke-color': '#fff'
        }
    });
    map.addLayer({
        //For an Unclustered point i.e stand alone points 
        //because without this you will only see clusters that dissapear when you zoom in
        id: 'unclustered-point-users',
        type: 'circle',
        source: 'users',
        // when there is no point count i.e unclustered
        filter: ['!', ['has', 'point_count']],
        paint: {
        'circle-color': '#ff0000',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        //white stroke
        'circle-stroke-color': '#fff'
        }
    });
    // inspect a cluster on click
    //what happens when you click on a cluster basically 
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('campgrounds').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;
                
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    map.on('click', 'clusters_users', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters_users']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('users').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;
                
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });
    
    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.


    // e is event object
    map.on('click', 'unclustered-point', (e) => {
        console.log(e.features[0])
        const text=e.features[0].properties.popupMarkup;
        const coordinates = e.features[0].geometry.coordinates.slice();
        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(text)
        .addTo(map);
    });
    map.on('click', 'unclustered-point-users', (e) => {
        console.log(e.features[0])
        const text=e.features[0].properties.popupMarkup;
        const coordinates = e.features[0].geometry.coordinates.slice();
        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(text)
        .addTo(map);
    });
    
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseenter', 'clusters_users', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('mouseleave', 'clusters_users', () => {
        map.getCanvas().style.cursor = '';
    });

});
map.addControl(new mapboxgl.NavigationControl());
