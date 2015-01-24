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

        var coid        = data[0];
        var ofid        = data[1];
        var name        = data[2];
        var address     = data[4] + data[5];
        var tel         = data[8];
        var url         = data[10];
        var opentime    = data[11];
        var restdates   = data[12];
        var description = data[13];
        var image       = getSpotImage(coid, ofid);
        //var image = "http://www.dummyimage.com/160x120";

        google.maps.event.addListener(marker, 'click', function() {
            var html = "";
            html += "<div style='width:300px;'>"
            html += "<h3>" + name + "</h3>"
            html += "<p><img src=\"" + image + "\" width=\"240\" height=\"180\"></p>";
            html += "<dl>";
            html += "<dt>住所</dt><dd>" + address + "</dd>";
            html += "<dt>電話番号</dt><dd>" + tel + "</dd>";
            if (url.length) {
                html += "<dt>URL</dt><dd>" + url + "</dd>";
            }
            html += "<dt>営業時間</dt><dd>" + opentime + "</dd>";
            html += "<dt>定休日</dt><dd>" + restdates + "</dd>";
            html += "<dt>特典内容</dt><dd>" + description + "</dd>";
            html += "</dl>";
            html += "</div>";
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(html);
            infowindow.open(map, marker);
        });
    }

    function getSpotImage(coid, ofid)
    {
        var url = "http://www.i-oyacomi.net/prepass/upimages/" + coid + ofid + "ofPic1_small.jpg";
        return url;
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

