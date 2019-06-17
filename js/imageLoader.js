// Takes an array of URLs and replaces them with image elements

function ImageLoader(imgs, callback){
	
	var cancelled = false;
	
	function loadImage (url, callback) {
		if (url instanceof HTMLImageElement){
			callback();
			return url;
		}
        var el = new Image();
        el.onload = function () { if(callback) callback() };
        el.src = url;
        return el;
    }
	
	function loadImageSequence (array, allDone) {
        var done = 0, len = array.length;
        if(!len && allDone) allDone(array);
        for (var i = 0; i < len; i++) {
            array[i] = loadImage(array[i], function () {
                if (++done === len && allDone && !cancelled) allDone(array);
            });
        }
    }
    
    var imgs = imgs || [];
    
    loadImageSequence(imgs, callback);
    
    this.cancel = function(){
    	cancelled = true;
    }
	
}