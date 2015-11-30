function getXmlHttp() {
  return new XMLHttpRequest();
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
};

function zeroFill( number, width )
{
  var n = number > 0xFF ? 0xFF : number;
  while( n.length < width ) {
    n = "0" + n;
  }
  
  return n;
};

function createColor( speed ) {
    var red = zeroFill( (255 - speed * 5).toString( 16 ), 2 );
    var green = zeroFill( (speed * 5).toString( 16 ), 2 );
    var color = "#" + red + green + "00";
    return color;
}