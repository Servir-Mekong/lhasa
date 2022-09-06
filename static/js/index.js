/* 
    ** Map Tab Scripts **
*/

// Queryselector
var sidebarContent = document.querySelector('#sidebar-content');
// var displayHomeSidebarContent = document.querySelector("#home" );
var displayFilterSidebarContent = document.querySelector("#filter" );
var displayLayerSidebarContent = document.querySelector("#layer" );
var displayBasemapSidebarContent = document.querySelector("#basemap" );
// var closeHomeSidebarContent = document.querySelector("#close-home-content" );
var closeFilterSidebarContent = document.querySelector("#close-filter-content" );
var closeLayerSidebarContent = document.querySelector("#close-layer-content" );
var closeBasemapSidebarContent = document.querySelector("#close-basemap-content" );

// Define map center
var MapOtions = {
    center: [15.5162, 102.9560],
    zoom: 5,
    minZoom: 5,
    maxZoom: 14,
    zoomControl: false
}

//create map
var map = L.map('map', MapOtions);

// Set default basemap
var basemap_layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Change zoom control postion to right
L.control.zoom({
    position: 'topright'
}).addTo(map);

// Add scale control to map
var scale = L.control.scale({
    position:'bottomright'
}).addTo(map);

// Onlick expand filter sidebar content area
displayFilterSidebarContent.onclick = function(){
    if (getComputedStyle(sidebarContent).display === "none"){
        sidebarContent.style.display ="block";
        sidebarContent.style.width = "350px";
        sidebarContent.style.marginLeft = "60px";
    } else if (sidebarContent.style.display === "block"){
        sidebarContent.style.width = "350px";
        sidebarContent.style.marginLeft = "60px";
    }else {
        sidebarContent.style.display = "none";
    }
};

// Onlick expand layer sidebar content area
displayLayerSidebarContent.onclick = function(){
    if (getComputedStyle(sidebarContent).display === "none"){
        sidebarContent.style.display ="block";
        sidebarContent.style.width = "350px";
        sidebarContent.style.marginLeft = "60px";
    } else if (sidebarContent.style.display === "block"){
        sidebarContent.style.width = "350px";
        sidebarContent.style.marginLeft = "60px";
    } else {
        sidebarContent.style.display = "none";
    }
}

// Onlick expand basemap sidebar content area
displayBasemapSidebarContent.onclick=function(){
    if (getComputedStyle(sidebarContent).display === "none"){
        sidebarContent.style.display ="block";
        sidebarContent.style.width = "350px";
        sidebarContent.style.marginLeft = "60px";
    } else if (sidebarContent.style.display === "block"){
        sidebarContent.style.width = "350px";
        sidebarContent.style.marginLeft = "60px";
    } else {
        sidebarContent.style.display = "none";
    }
}

// Onclick close sidebar home content area
// closeHomeSidebarContent.onclick = function(){
//     sidebarContent.style.display = "none";
// }
// Onclick close sidebar home content area
closeFilterSidebarContent.onclick = function(){
    sidebarContent.style.display = "none";
}
// Onclick close sidebar layer content area
closeLayerSidebarContent.onclick = function(){
    sidebarContent.style.display = "none";
}
// Onclick close sidebar basemap content area
closeBasemapSidebarContent.onclick = function(){
    sidebarContent.style.display = "none";
}

/* 
    Filter Panel 
*/

/** End Layer Panel */

/* 
    Basemap Panel
*/

// Onclick switch basemap 
$('#nav-basemap div').on('click', function(e) {
    var selected_basemap = this.getAttribute('data-layer');
    if(selected_basemap === "osm"){
        basemap_layer.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');    
    }else if((selected_basemap === "street")){
        basemap_layer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}');
    }else if(selected_basemap === "satellite"){
        basemap_layer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
    }else if(selected_basemap === "terrain"){
        basemap_layer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}');
    }
    else if(selected_basemap === "topo"){
        basemap_layer.setUrl('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    }
    else if(selected_basemap === "dark"){
        basemap_layer.setUrl('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
    }
    else if(selected_basemap === "gray"){
        basemap_layer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}');
    } 
});
/** End Basemap Panel */

/* 
   ========= Earth engine layer ============
*/
// var selected_date = $('#dateSelection').val(); //'2022-07-30'
// var selected_date = $('#date_selection').val();

// get datelist
var dateList;
$.ajax({
    url: '/ajax/nowcastdate/',
    type: "GET",
    dataType: "json",
    async: false,
    success: (data) => {
        // console.log(data);
        dateList = data;
        var latestData = dateList.slice(-1);
        // console.log(latestData);
        $('#date_selection_nowcast').val(latestData);

        var enableDates = data;
        var enableDatesArray=[];
        $("#date_selection_nowcast").datepicker("destroy");
        for (var i = 0; i < enableDates.length; i++) {
            var dt = enableDates[i];
            var dd, mm, yyyy;
            if (parseInt(dt.split('-')[2]) <= 9 || parseInt(dt.split('-')[1]) <= 9) {
                dd = parseInt(dt.split('-')[2]);
                mm = parseInt(dt.split('-')[1]);
                yyyy = dt.split('-')[0];
                enableDatesArray.push(yyyy + '-' + mm + '-' + dd);
            }
            else {
                enableDatesArray.push(dt);
            }
        }
        $('#date_selection_nowcast').datepicker({
            beforeShow: function (input, inst) {
                setTimeout(function () {
                    inst.dpDiv.css({
                        top: $(".datepicker").offset().top + 35,
                        left: $(".datepicker").offset().left
                    });
                }, 0);
            },
            beforeShowDay: function (date) {
                var dt_ddmmyyyy = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() ;
                if (enableDatesArray.indexOf(dt_ddmmyyyy) !== -1) {
                    return {
                        tooltip: 'There is data available',
                        classes: 'active'
                    };
                } else {
                    return false;
                }
            }
        });
    },
    error: (error) => {
        console.log(error);
    }
});

const td = new Date();
var forcasted_date = td.toISOString().split('T')[0];
// console.log(forcasted_date);
$('#date_selection_forecast').val(forcasted_date);

// Define Earth Engine LHASA Layer in Leaflet
var lhasa_layer = L.tileLayer('', {
    attribution: '&copy; <a href="https://earthengine.google.com" target="_blank">Google Earth Engine</a> contributors'
}).addTo(map);

var selected_date_nowcast = $('#date_selection_nowcast').val();
var selected_date_forecast = $('#date_selection_forecast').val();
var selected_model = $("#modelSelection").val();
// console.log(selected_model);
// console.log(selected_viz);
if (selected_model == "nowcast"){
    $("#nowcast-date-panel").show();
    $("#forecast-date-panel").hide();
} else if (selected_model == "forecast"){
    $("#nowcast-date-panel").hide();
    $("#forecast-date-panel").show();
}
$('#modelSelection').change(function(){
    var selected_model = $("#modelSelection").val();
    if (selected_model == "nowcast"){
        $("#nowcast-date-panel").show();
        $("#forecast-date-panel").hide();
    } else if (selected_model == "forecast"){
        $("#nowcast-date-panel").hide();
        $("#forecast-date-panel").show();
    }
});

$.ajax({
    url: '/ajax/lhasamap/',
    type: "GET",
    data: {
        "selected_date_nowcast": selected_date_nowcast,
        "selected_model": selected_model,
        "selected_date_forecast": selected_date_forecast
    },
    dataType: 'json',
    // async: false,
    success: (data) => {
        lhasa_layer.setUrl(data); 
    },
    error: (error) => {
        console.log(error);
    }
});

$('#date_selection_nowcast').change(function(){
    updateOpsMap();
});

$('#date_selection_forecast').change(function(){
    updateOpsMap();
});

$('#modelSelection').change(function(){
    updateOpsMap();
});

// update map
function updateOpsMap(){
    var selected_date_nowcast = $('#date_selection_nowcast').val();
    var selected_date_forecast = $('#date_selection_forecast').val();
    var selected_model = $("#modelSelection").val();

    $.ajax({
        url: '/ajax/lhasamap/',
        type: "GET",
        data: {
            "selected_date_nowcast": selected_date_nowcast,
            "selected_model": selected_model,
            "selected_date_forecast": selected_date_forecast
        },
        dataType: 'json',
        // async: false,
        success: (data) => {
            lhasa_layer.setUrl(data); 
        },
        error: (error) => {
            console.log(error);
        }
    });
}

/* ============================== Precipitation Layer ============================= */
var d = new Date();
d.setDate(d.getDate() - 1);
var precip_date = d.toISOString().split('T')[0]
document.getElementById('date_selection_precip').value = precip_date;

var prod = $('#product_selection').val();
var cmap = $('#cmap_selection').val();
var accum = prod.split('|')[0];
var selected_date_precip = $('#date_selection_precip').val();

// Define Earth Engine Precipitation Layer in Leaflet
var precip_layer = L.tileLayer('', {
    attribution: '&copy; <a href="https://earthengine.google.com" target="_blank">Google Earth Engine</a> contributors'
});

// Get Precipitation Layer 
$("#precipCB").on("click", function(){
    if(this.checked) {
        // $("#loader").show();
        $.ajax({
            url: '/ajax/precipmap/',
            type: "GET",
            data: {
                "selected_date_precip": selected_date_precip,
                "cmap": cmap,
                "accum": accum
            },
            dataType: 'json',
            success: (precip_data) => {
                precip_layer.setUrl(precip_data);  
                // $("#loader").hide();
                // setTimeout(function() { $("#loader").hide(); }, 8000);  
            },
            error: (error) => {
                console.log(error);
                // $("#error-overlay").css({ display: "block" });
                // $("#loader").hide();
            }
        });         
    }
});  

// Check add or remove precipitation layer to overlay on map
$("#precipCB").on("click", function(){
    if(this.checked) {
        map.addLayer(precip_layer);                 
    } else {
        map.removeLayer(precip_layer);
    }
});  
// Defining function to update layer 
$('#date_selection_precip').change(function(){
    updatePrecipitationData();
});
$('#cmap_selection').change(function(){
    updatePrecipitationData();
});
$('#product_selection').change(function(){
    updatePrecipitationData();
});

// Defining function to update precipitation map
function updatePrecipitationData(){
    // $("#loader").show();
    var prod = $('#product_selection').val();
    var cmap = $('#cmap_selection').val();
    var accum = prod.split('|')[0];
    var selected_date_precip = $('#date_selection_precip').val();
    $.ajax({
        url: '/ajax/precipmap/',
        type: "GET",
        data: {
            "selected_date_precip": selected_date_precip,
            "cmap": cmap,
            "accum": accum
        },
        dataType: 'json',
        success: (precip_data) => {
            //console.log(precip_data);
            precip_layer.setUrl(precip_data);  
            // $("#loader").hide();
            // setTimeout(function() { $("#loader").hide(); }, 8000);
        },
        error: (error) => {
            console.log(error);
            // $("#error-overlay").css({ display: "block" });
            // $("#loader").hide();
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////


// Define country boundary style
var adm0Style = {
    color: "#6A5ACD",
    weight: 1.0,
    fillOpacity: 0.0,
    fillColor: '#ffc107'
};
var adm1Style = {
    color: "#6A5ACD",
    weight: 1.0,
    fillOpacity: 0.0,
    fillColor: '#ffc107'
};
var adm2Style = {
    color: "#6A5ACD",
    weight: 0.2,
    fillOpacity: 0.0,
    fillColor: "#ffc107",
    cursor: 'pointer'
};
// highlight admin feature style
var highlightStyle = {
    color: '#000', 
    weight: 1.5,
    fillOpacity: 0.0,
    fillColor: '#ffc107' 
};

var adm0_layer = L.geoJson(adm0, {
    style: adm0Style,
    onEachFeature: function(feature, admin0Layer) {
        admin0Layer.bindTooltip(feature.properties.NAME_0);                
    } 
});

var adm1_layer = L.geoJson(adm1, {
    style: adm1Style,
    onEachFeature: function(feature, admin1Layer) {
        admin1Layer.bindTooltip(feature.properties.NAME_1);                 
    } 
});

var adm2_layer = L.geoJson(adm2, {
    style: adm2Style,
    onEachFeature: function(feature, adm2Layer){

        // Display a popup with the name of the county.
        var district = feature.properties.NAME_2;
        var province = feature.properties.NAME_1;
        var country = feature.properties.NAME_0;
        var f_0_15 = feature.properties.F_0_15;
        var f_15_65 = feature.properties.F_15_65;
        var f_above_65 = feature.properties.F__65;
        var f_total = f_0_15 + f_15_65 + f_above_65;
        var m_0_15 = feature.properties.M_0_15;
        var m_15_65 = feature.properties.M_15_65;
        var m_above_65 = feature.properties.M__65;    
        var m_total = m_0_15+m_15_65+m_above_65;
        var hospitals = feature.properties.Hospitals;
        var primary = feature.properties.Primary;
        var secondary = feature.properties.Secondary;
        var trunks = feature.properties.Trunks;

        adm2Layer.on('mouseover', function (e) {
            this.setStyle(highlightStyle);
            this.bindPopup( 
                '<h4 style="margin-top: 20px; font-weight: bold; margin-bottom: 0px;">'+district+': '+province+', '+country+'</h4>'+
                '<div class="table-responsive adm2-popup-table">'+
                    '<table class="table">'+
                        '<thead>'+
                            '<tr>'+
                                '<th>'+"Population"+'</th>'+
                                '<th>'+"Female"+'</th>'+
                                '<th>'+"Male"+'</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>' +
                            '<tr>'+
                                '<td>'+"Age 0-15"+'</td>'+
                                '<td>'+f_0_15+'</td>'+
                                '<td>'+m_0_15+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+"Age 15-65"+'</td>'+
                                '<td>'+f_15_65+'</td>'+
                                '<td>'+m_15_65+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+"Age >65"+'</td>'+
                                '<td>'+f_above_65+'</td>'+
                                '<td>'+m_above_65+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+"Total"+'</td>'+
                                '<td>'+f_total+'</td>'+
                                '<td>'+m_total+'</td>'+
                            '</tr>'+
                        '</tbody>'+
                        '<thead>'+
                            '<tr>'+
                                '<th>'+"Health Facilities"+'</th>'+
                                '<th>'+"No."+'</th>'+
                                '<th>'+""+'</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<td>'+ "Hospitals" +'</td>'+
                                '<td>'+ hospitals +'</td>'+
                                '<td>'+""+'</td>'+
                            '</tr>'+
                        '</tbody>'+
                        '<thead>'+
                            '<tr>'+
                                '<th>'+"Roads"+'</th>'+
                                '<th>'+"No."+'</th>'+
                                '<th>'+""+'</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<td>'+ "Primary" +'</td>'+
                                '<td>'+ primary +'</td>'+
                                '<td>'+""+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+ "Secondary" +'</td>'+
                                '<td>'+ secondary +'</td>'+
                                '<td>'+""+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+ "Trunks" +'</td>'+
                                '<td>'+ trunks +'</td>'+
                                '<td>'+""+'</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</div>'
            );
            // this.bindTooltip(feature.properties.NAME_2);
        }); 
        adm2Layer.on('mouseout', function (e) {
            this.setStyle(adm2Style);
        }); 
        adm2Layer.on('click', function(e){
            map.fitBounds(e.target.getBounds());
            // animate: true;
        });        
    }
});

$('input[type=checkbox][name=adm0_toggle]').click(function(){
    if(this.checked) {
        map.addLayer(adm0_layer);
    } else {
        map.removeLayer(adm0_layer);
    }
});

$('input[type=checkbox][name=adm1_toggle]').click(function(){
    if(this.checked) {
        map.addLayer(adm1_layer);
    } else {
        map.removeLayer(adm1_layer);
    }
});

$('input[type=checkbox][name=adm2_toggle]').click(function(){
    if(this.checked) {
        map.addLayer(adm2_layer);
    } else {
        map.removeLayer(adm2_layer);
    }
});

map.on('mouseover zoomend', function() {
    if(map.getZoom() >= 7 ) {
        map.removeLayer(adm0_layer);
        $("#adm0_toggle").prop("checked", false);
    } else {
        map.addLayer(adm0_layer);
        $("#adm0_toggle").prop("checked", true);
    }
});
map.on('mouseover zoomend', function() {
    if(map.getZoom() <= 6) {
        map.removeLayer(adm1_layer);
        $("#adm1_toggle").prop("checked", false);
    } else {
        map.addLayer(adm1_layer);
        $("#adm1_toggle").prop("checked", true);
    }
});
map.on('mouseover zoomend', function() {
    if(map.getZoom() >= 8) {
        map.removeLayer(adm1_layer);
        $("#adm1_toggle").prop("checked", false);
    }
});
map.on('mouseover zoomend', function() {
    if(map.getZoom() < 8) {
        map.removeLayer(adm2_layer);
        $("#adm2_toggle").prop("checked", false);
    } else {
        map.addLayer(adm2_layer);
        $("#adm2_toggle").prop("checked", true);
    }
});

$("#adm0CB").on("click",function(){
    if(this.checked){
        map.addLayer(adm0_layer);
    }
    else{
        map.removeLayer(adm0_layer);
    }
});
$("#adm1CB").on("click",function(){
    if(this.checked){
        map.addLayer(adm1_layer);
    }
    else{
        map.removeLayer(adm1_layer);
    }
});
$("#adm2CB").on("click",function(){
    if(this.checked){
        map.addLayer(adm2_layer);
    }
    else{
        map.removeLayer(adm2_layer);
    }
});