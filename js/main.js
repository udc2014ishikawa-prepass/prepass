$(function(){
    initlaize();
    function initlaize() {
        getLocation();
    }

    function showGoogleMap(initLat, initLng) {
        var latlng = new google.maps.LatLng(initLat, initLng);
        var opts = {
            zoom: 16,
center: latlng,
mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), opts);

        //現在地のピン
        /*
        var now_latlng = new google.maps.LatLng(initLat, initLng);
        var now_marker = new google.maps.Marker({
            position:now_latlng,
            title: '現在地',
            map: map,
        });
        */

        pushPins(map);
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
        } else {
            errorCallback();
        }
    }

    function successCallback(pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        $('#loading').hide();
        showGoogleMap(lat, lng);
    }

    function errorCallback() {
        alert("cannot get location");
    }

    function pushPins(map)
    {
        csvToArray('data/prepath.csv', function(data){
            for (i in data){
                if (i == 0) {
                    continue;
                }
                pushPin(map, data[i]);
            }
        });
    }

    function pushPin(map, data) {
        //現在地のピン
        var lat = data[6];
        var lng = data[7];
        var latlng = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position:latlng,
            map: map
        });

        var name = data[2];

        google.maps.event.addListener(marker, 'click', function() {
            var html = name;
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(html);
            infowindow.open(map, marker);
        });
    }

    function csvToArray(filename, callback) {
        $.get(filename, function(csvdata) {
            //CSVのパース作業
            //CRの解析ミスがあった箇所を修正しました。
            //以前のコードだとCRが残ったままになります。
            // var csvdata = csvdata.replace("\r/gm", ""),
            csvdata = csvdata.replace(/\r/gm, "");
            var line = csvdata.split("\n"),
        ret = [];
        for (var i in line) {
            //空行はスルーする。
            if (line[i].length == 0) continue;

            var row = line[i].split(",");
            ret.push(row);
        }
        callback(ret);
        });
    }
});

