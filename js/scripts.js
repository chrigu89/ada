function external(url) {
    var ref = window.open(url, '_blank', 'location=yes,enableViewPortScale=yes');
}

function pdf(url) {
    if (navigator.userAgent.match(/(Android)/)) {
		downloadFile(url);
    } else {
        var ref = window.open(url, '_blank', 'location=yes,enableViewPortScale=yes');
    }
}

function image(url) {
    var ref = window.open(url, '_blank', 'location=yes,enableViewPortScale=yes');
}


/*Wenn die DropDowns Beim Firefox nicht funktionieren muss dieser Code deaktiviert werden*/
function disableselect(e) {
    return false
}

function reEnable() {
    return true
}
document.onselectstart = new Function("return false")
if (window.sidebar) {
    document.ontouchstart = disableselect
    document.ontouchmove = disableselect
    document.ontouchend = disableselect
    document.onmousedown = disableselect
}


$(window).load(function() {

})

function NachOben() {
    var y = 0;
    var x = 0;
    if (window.pageYOffset) {
        y = window.pageYOffset;
    } else if (document.body && document.body.scrollTop) {
        y = document.body.scrollTop;
    }
    if (y > 0) {
        window.scrollBy(-0, -10);
        setTimeout("NachOben()", 5);
    }
}

$(window).ready(function() {

    $("#content").css({
        "opacity": 1
    });

    $("#load_").delay(350).fadeOut(300, 'easeInQuart', function() {
        $('#load_').removeClass("loader_img");
    });
	


})

function populateDB(tx) {
	 tx.executeSql('DROP TABLE IF EXISTS DEMO');
	 tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
	 tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
	 tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

// Transaction error callback
//
function errorCB(tx, err) {
	alert("Error processing SQL: "+err);
}

// Transaction success callback
//
function successCB() {
	//alert("success!");
}





var onReady = function() {
	

    function neu_seite(url) {

        $('body').animate({
            opacity: 0
        }, 300, 'easeInQuart', function() {

            window.location.href = url;

        });

    }

    xWidth = null;
    if (xWidth == null) {
        if (window.innerWidth != null)
            xWidth = window.innerWidth;

    }

    xHeight = window.innerHeight;



    function men_display(nb) {

        $(".menu").css({
            'display': nb
        });
    }

    //LinkToutch--------------------------------------------------------------------------------------------
    bewegung = false;
    tatsch = false;
    var LinkToutch = {

        elements: ['a'],
        setup: function() {
            for (j = 0; j < LinkToutch.elements.length + 1; j++) {


                for (i = 0; i < document.getElementsByTagName(LinkToutch.elements[j]).length; i++) {

                    var el = document.getElementsByTagName(LinkToutch.elements[j])[i];

                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        el.onmousedown = LinkToutch.touchstart;
                        el.onmouseup = LinkToutch.touchend;
                        el.onmousemove = LinkToutch.touchmove;
                    } else {
                        el.ontouchstart = LinkToutch.touchstart;
                        el.ontouchend = LinkToutch.touchend;
                        el.ontouchmove = LinkToutch.touchmove;
                    }
                }
            }
        },
        touchstart: function() {

            $(this).addClass("a_hover");
            bewegung = false;

        },
        touchmove: function(event) {
            bewegung = true;
            $(".a_hover").removeClass("a_hover");

        },

        touchend: function() {
            $(this).removeClass("a_hover");

            if (!bewegung) {
                if (this.className.indexOf("kalender") >= 0) {
                    kalender(this.rel);
                }
                if (this.id == 'alert_btn') {
                    LinkToutch.alert_schliessen();

                } else if (this.className.indexOf("feed") >= 0) {
                    //window.location.href=this.rel;
                    LinkToutch.feedback(this.id, this.rel);

                } else if (this.id.indexOf('#') >= 0) {
                    LinkToutch.formssenden(this.id);
                } else if (this.id == 'zip_btn') {
                    zip_btn_akt();
                } else if (this.className.indexOf('alert_') >= 0) {
                    LinkToutch.alert_ausgeben(this.rel);
                } else {

                    if (this.id != 'load_' && this.id != 'alert_btn' && this.href == '') {
                        if (this.className.indexOf('onclick_external') >= 0) {
                            external(this.rel);
                        } else if (this.className.indexOf('onclick_image') >= 0) {
                            image(this.rel);
                        } else if (this.className.indexOf('onclick_external') >= 0) {
                            image(this.rel);
                        } else if (this.className.indexOf('onclick_pdf') >= 0) {
                            pdf(this.rel);
                        } else {
                            neu_seite(this.rel);
                        }
                    } else {

                    }
                }
            }
        }
    }
    LinkToutch.setup();



}


$(document).ready(onReady);
