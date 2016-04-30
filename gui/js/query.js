var state="macro";
var none_blank= false;
var vectors, terms, idf_values, titles, urls, results, featured, showcase, query, new_vector;
var res_desc=[];
var query_vect = [];
var relevant_docs= [];

$.ajaxPrefilter( function (options) {
		  if (options.crossDomain && jQuery.support.cors) {
		    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
		    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
		    //options.url = "http://cors.corsproxy.io/url=" + options.url;
		  }
		});

var get_meta=function(location){
	$.get(location, function (response) {
					        var extract= response;
					        var description_holder="";
					        var metas= [];
					        var start= extract.indexOf('<meta name="description');
							if(start!= -1){
								var temp = extract.substring(start+23, start+600);
								start = temp.indexOf('content="');
								temp=temp.replace(/ +/g, ' ');
								extract=temp.substring(start+9, temp.length);
								extract=extract.replace('" />', "");
								description_holder+=extract.replace(/<\/?[^>]+(>|$)/g, "");
								res_desc.push({url:location, desc:description_holder});
							}else{
								var start= extract.indexOf('<p');
								var extract = extract.substring(start, start+800);
								var temp_elem = document.createElement('temp');
								description_holder=extract.replace(/<\/?[^>]+(>|$)/g, "");;;
								res_desc.push({url:location, desc:description_holder});
							}
					    });

}

jQuery.get('Index/idfvals.JSON', function(source) {
	idf_values=source;
});
jQuery.get('Index/vectors.JSON', function(source) {
	vectors=source;
});
jQuery.get('Index/terms.txt', function(source) {
	terms=source.split(",");
});
jQuery.get('Index/titles.txt', function(source) {
	titles=source.split("~$!~");
});
jQuery.get('Index/urls.txt', function(source) {
	urls=source.split("~$!~");
});

var show_sims=function(str){
	var arr = filter(sort_similarities(get_similarities(str)));
	var temp= [];
	for(var i=0; i<(Math.min(arr.length, 10)); i++){
		temp.push(arr[i].docId);
	}
	return temp;
}

var init = function(keycode_value){
	if(state== "macro" && document.getElementById('searchbox').value!= ""){
		if (/\S/.test(document.getElementById('searchbox').value)){
			become_micro();
			document.getElementById("searchbox_mini").focus();
		}
	}

	if(state== "micro" && document.getElementById('searchbox_mini').value.length==0){
		become_macro();
		document.getElementById("searchbox").focus();
	}

	if(state=="micro" && document.getElementById('searchbox_mini').value!=""){
			document.getElementById("results").innerHTML='<span style="font-size:85%;"><i>Press Enter to Search Away..!</i></span>';
			if(keycode_value==13){
				res_desc=[];
				relevant_docs=[];
				document.getElementById("results").innerHTML='';
				// Run a document search and show regular results
				query = normalize(vectorize(document.getElementById('searchbox_mini').value));
				results=filter(sort_similarities(get_similarities(query)));
				if(results.length==0){
					document.getElementById("results").innerHTML+= "<br><br><span style='font-size:120%'>Your query - <strong>"+document.getElementById('searchbox_mini').value+"</strong> - did not return any results.";
					document.getElementById("results").innerHTML+= "<br><br><p>Suggestions:<ul><li>Is everything spelled correctly?</li><li>Could you try different/more general keywords?</li></ul></p></span>"

				}/*else if(results.length>=10){
					document.getElementById("results").innerHTML+='<div id="featured" style="width:180%;background-color: #F7F8E0;border-radius:5px;padding-left: 15px;padding-right: 15px;padding-top: 15px;padding-bottom: 0px; "></div>';
					for(i=0; i<(Math.min(10, results.length)); i++){
						
						var description_holder= urls[results[i].docId-1].replace(/[^a-z\d\s]+/gi, "");
						var m = document.createElement('p');
						m.setAttribute("id", description_holder);

						var loc="results";
						if(i<2) loc="featured";
						
						document.getElementById(loc).innerHTML+= 
						"<span style='font-size:120%'><strong><a href='"+urls[results[i].docId-1]+"' target='_blank'>"+ titles[results[i].docId-1]+"</strong></a></span>";
						document.getElementById(loc).innerHTML+="<br><span style='color:#04B431;font-size:100%'>"+urls[results[i].docId-1]+"</span><br>";
						document.getElementById(loc).appendChild(m);
						get_meta(urls[results[i].docId-1]);
						document.getElementById(loc).innerHTML+= "<hr>";
					}
				}*/else{
					print_results();
				}
				meta_delay();
				document.getElementById("results").innerHTML+= "<br><br><br><br>";
			}
	}
	
}

var meta_delay= function(){
	$(function() {
				    var intervalID = setInterval(function() {
				        desc_printer(document.getElementById('searchbox_mini').value);
				    }, 300);
				    setTimeout(function() {
				        clearInterval(intervalID);
				    }, 5000);
				});
}
var print_results=function(){
	for(i=0; i<results.length; i++){						
						var description_holder= urls[results[i].docId-1].replace(/[^a-z\d\s]+/gi, "");
						var m = document.createElement('p');
						m.setAttribute("id", description_holder);

						document.getElementById("results").innerHTML+= 
						"<span style='font-size:120%'><strong><a href='"+urls[results[i].docId-1]+"' target='_blank'>"+ titles[results[i].docId-1]+"</strong></a></span>";
						document.getElementById("results").innerHTML+="<span style='font-size:70%;'><a style='color:#04B45F' href='#' onClick='add_rel("+i+")'>Relevant</a>&nbsp;<a style='color:#F78181' href='#' onClick='rem_rel("+i+")'>Irelevant</a></span>"
						document.getElementById("results").innerHTML+="<br><span style='color:#04B431;font-size:100%'>"+urls[results[i].docId-1]+"</span><br>";
						document.getElementById("results").appendChild(m);
						get_meta(urls[results[i].docId-1]);
						document.getElementById("results").innerHTML+= "<hr>";
					}

}

var add_rel= function (x){
	var exists = relevant_docs.indexOf(results[x]);
	if(exists == -1){
		relevant_docs.push(results[x]);
	}
	relevance_print();
}

var rem_rel= function (x){
	var exists = relevant_docs.indexOf(results[x]);
	if(exists != -1){
		relevant_docs.splice(exists, 1);
	}
	relevance_print();
}

var relevance_print= function(){
	if (relevant_docs.length > 0){
		var new_state="<div class='alert alert-danger'>";
		for(var i=0; i<relevant_docs.length; i++){
			new_state= new_state+relevant_docs[i].docTitle+" is relevant.<br/>";
		}
		new_state+="</div>";
		document.getElementById("relevant").innerHTML="<div class='row'><a class='btn btn-success btn-sm' style='float:right' onClick='refine_search()'>Refine Search</a></div>";
		document.getElementById("relevant").innerHTML+=new_state;
	}else {
		document.getElementById("relevant").innerHTML="";
	}
}
var refine_search= function(){
	if(relevant_docs.length > 0){
		res_desc=[];
		new_vector=[];
		document.getElementById("relevant").innerHTML="<div class='alert alert-success'>Calculating...</div>";
		document.getElementById("results").innerHTML='';
		
			for(var i=0; i<query.length; i++){
				new_vector.push(query[i]+(0.5*relevant_docs[0].vect[i]));
			}
		results=filter(sort_similarities(get_similarities(normalize(new_vector))));
		document.getElementById("relevant").innerHTML="";
		relevant_docs=[];
		print_results();
		meta_delay();
	}
}

var desc_printer= function(qr){
	var arr= res_desc;
	var query_words =tokenize_query(qr.toLowerCase());
	for (var i=0; i<arr.length; i++){
		var p =document.getElementById(arr[i].url.replace(/[^a-z\d\s]+/gi, ""));
		var orig_string= arr[i].desc;
		var description= highlighter(orig_string, query_words);
		p.innerHTML='<p style="color:#A4A4A4">'+description+"... </p><br>";
	}
}

var highlighter=function(str, words){
	for(var i=0; i<words.length; i++){
		var pattern= words[i];
		var re = new RegExp(pattern, "g");
		str= str.replace(re, "<span style='color:black'><strong>"+pattern+"</strong></span>");
		var camel =pattern.substring(0, 1).toUpperCase() + pattern.substring(1).toLowerCase();
		var reCap = new RegExp (camel, "g");
		str= str.replace(reCap, "<span style='color:black'><strong>"+camel+"</strong></span>");
	}
	return str;
}

var filter=function(arr){
	var filtered= [];
	for(var i=0; i<arr.length; i++){
		if(arr[i].sim >0){
			filtered.push(arr[i]);
		}else break;
	}
	return filtered;
}
	
var vectorize=function(str){
	var query_words =tokenize_query(str.toLowerCase());
	query_vect = [];
	for (var i=0; i<terms.length; i++) query_vect.push(0);
	for(var i=0; i<query_words.length; i++){
		if(terms.indexOf(query_words[i]) != -1){
			query_vect[terms.indexOf(query_words[i])] += idf_values[query_words[i]];	
		}
	}
	query_vect = normalize(query_vect);
	return query_vect;
}

var normalize= function(vect){
	var vector_length= get_length(vect);
	if(vector_length==0) vector_length=1;
	for(var i=0; i<vect.length; i++){
		vect[i]=vect[i]/vector_length;
	}
	return vect;
}

var get_length=function(vect){
	var accumulator=0;
	for(var i=0; i<vect.length; i++){
		accumulator+= vect[i]*vect[i];
	}
	return Math.sqrt(accumulator);
}

var get_similarities=function(normalized_vect){
	var query_vect = normalized_vect;	
	var similarity_records=[];

	// calculate similarity between query and each vector
	for(var i=1; i<=(Object.keys(vectors)).length; i++){
		//Multiplication of corresponding values
		var similarity=0; //contains multiplied values
		for(var j=0; j<vectors[i].length; j++){
			similarity+= query_vect[j]*vectors[i][j];
		}
		similarity_records.push({docId:i,sim:similarity,vect:vectors[i],docTitle:titles[i-1]});
	}
	return similarity_records;
}

function sort_similarities(a) {
	if (a.length <= 1) return a;
	var left = [], right = [], pivot = a[0].sim;

	for (var i = 1; i < a.length; i++) {
		a[i].sim > pivot ? left.push(a[i]) : right.push(a[i]);
	}
	return sort_similarities(left).concat(a[0], sort_similarities(right));
}

var tokenize_query = function(str){
	str = str.replace(/[^a-z\d\s]+/gi, "");
	var words = []; 
	str.split(/(\W)/).forEach(function(elem) {
		if (!/^\s*$/.test(elem)) { 
			words.push(elem);
		}});
		return words; 
}

var become_micro=function(){
	var buffer = document.getElementById('searchbox').value;
		document.getElementById('search_box_holder').innerHTML= '<div class="jumbotron" style="width: 100%; margin-top:-20px;margin-right:-20px;padding:35px;"><input type="text" id="searchbox_mini" placeholder="Search..." style="background-color :#F2FBEF; padding: 10px;margin: 10px;"onKeyUp="init(event.keyCode);"></div>';
		document.getElementById('searchbox_mini').value = buffer;
		state= "micro";
}

var become_macro= function(){
	var buffer = document.getElementById('searchbox_mini').value;
	document.getElementById('search_box_holder').innerHTML= '<div class="row">&nbsp;</div><div class="row">&nbsp;</div><div class="row">&nbsp;</div><div class="container"><div class="jumbotron" style="width: 70%;margin: auto;"><h1>Search away... </h1><input type="text" id="searchbox" placeholder="Search..." style="background-color :#F2FBEF; padding: 10px;margin: 10px;" onKeyUp="init(event.keyCode);"><a class="btn btn-success" onclick="init()" style="margin: 10px;">Search</a></div></div>'
	document.getElementById('searchbox').value = buffer;
		state= "macro";
		document.getElementById("results").innerHTML="";
}