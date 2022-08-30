function DownloadZipFile(arFileArray, sZipFileName) { 
    var Promise = window.Promise; 
    if (!Promise) { 
        Promise = JSZip.external.Promise; 
    } 
    function urlToPromise(url) { 
        return new Promise(function (resolve, reject) { 
            JSZipUtils.getBinaryContent(url, function (err, data) { 
                if (err) { reject(err); } 
                else { resolve(data); } }); 
            }); 
        } 
        if (!JSZip.support.blob) { 
            showError("This demo works only with a recent browser !");		
            //return;	
        }	
        var zip = new JSZip();	
        for(var i = 0; i < arFileArray.length; i++) {					
            var url = arFileArray[i];		
            var filename = url.replace(/.*\//g, "");		
            zip.file(filename, urlToPromise(url), {binary:true});	
        }	
        // when everything has been downloaded, we can trigger the dl	
        zip.generateAsync({type:"blob"}, function updateCallback(metadata) {	}).then(function callback(blob) {		
            // see FileSaver.js		
            saveAs(blob, sZipFileName);	
        }, function (e) {		
            showError(e);	
    })
}