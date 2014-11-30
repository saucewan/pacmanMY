function validateName(query){
	name=query;
	var url="http://www2.comp.polyu.edu.hk/~12130691d/pacman/validateName.php?query="+query;
	
	try
	{
		asyncRequest=new XMLHttpRequest();
		asyncRequest.onreadystatechange = processResponse;
		asyncRequest.open( 'GET', url, true );
		asyncRequest.send( null );
	}
	catch(exception)
	{
		alert("Request Failed");
	}	
}


function checkForm(){
	var username1=document.getElementById("username").innerHTML;
	var choosegender=document.getElementsByName("gender");
	var chooseagegroup=document.getElementsByName("agegroup");
	
	var gender;
	var agegroup;
	
	if(choosegender[0].checked)
		gender=choosegender[0].value;
	else if(choosegender[1].checked)
		gender=choosegender[1].value;
		
	if(chooseagegroup[0].checked)
		agegroup=chooseagegroup[0].value;
	else if(chooseagegroup[1].checked)
		agegroup=chooseagegroup[1].value;
	else if(chooseagegroup[2].checked)
		agegroup=chooseagegroup[2].value;
			
	if(username1=="× Name existed")
		alert("Please change to another name");
	else if(username1=="√ Valid"){
		var url="http://www2.comp.polyu.edu.hk/~12130691d/pacman/login.php?name="+name+"&agegroup="+agegroup+"&gender="+gender;
	
		try
		{
			asyncRequest=new XMLHttpRequest();
			asyncRequest.onreadystatechange = loginAlready;
			asyncRequest.open( 'GET', url, true );
			asyncRequest.send( null );
		}
		catch(exception)
		{
			alert("Request Failed");
		}	
	}		
	
}
function processResponse(){
	if ( asyncRequest.readyState == 4 && asyncRequest.status == 200 && asyncRequest.responseText){
		document.getElementById("username").innerHTML=asyncRequest.responseText;	
	}
}

function loginAlready(){
	if ( asyncRequest.readyState == 4 && asyncRequest.status == 200){
		document.getElementById("newform").submit();
	}
}