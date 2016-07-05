var id_a=new Array();
	for(var i = 0; i < 20; i++) {
		id_a[i]='';
	}
id_a[activ]=' id="active"';

menu='<ul id="m1">'
+'<li><a'+id_a[0]+' class="icon-home" rel="index.php" href="index.html" >Home</a></li>'
+'<li><a'+id_a[1]+' class="icon-termine" rel="termine.php"  href="termine.html">Termine</a></li>'
+'<li><a'+id_a[2]+' class="icon-about" rel="ueber_uns.php"  href="ueber_uns.html" >Über uns</a></li>'
+'<li><a'+id_a[3]+' class="icon-wissen" rel="wissen.php"  href="wissen.html">Wissen</a></li>'
+'<div class="clr"></div>'
+'</ul>';
document.write(menu);