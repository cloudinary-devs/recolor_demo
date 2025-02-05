const cloudName = "hzxyensd5"; // replace with your own cloud name
const uploadPreset = "docs_gen_ai_color_demo"; // replace with your own upload preset

// Remove the comments from the code below to add
// additional functionality.
// Note that these are only a few examples, to see
// the full list of possible parameters that you
// can add see:
//   https://cloudinary.com/documentation/upload_widget_reference

var calls=0;
const myWidget = cloudinary.createUploadWidget(
{
  cloudName: cloudName,
  uploadPreset: uploadPreset,
  maxFiles: 1
  // cropping: true, //add a cropping step
  // showAdvancedOptions: true,  //add advanced options (public_id and tag)
  // sources: [ "local", "url"], // restrict the upload sources to URL and local files
  // multiple: false,  //restrict upload to a single file
  // folder: "user_images", //upload files to the specified folder
  // tags: ["users", "profile"], //add the given tags to the uploaded files
  // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
  // clientAllowedFormats: ["images"], //restrict uploading to image files only
  // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
  // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
  // theme: "purple", //change to a purple theme
},
(error, result) => {
  if (!error && result && result.event === "success") { 
    if(result.info.moderation[0].status=="approved"){

    var img_url=result.info.secure_url;
    var format = img_url.substring(img_url.length - 3);
    if (format=="jpg" || format=="png"){
      document.getElementById("orig_heading").innerHTML = "Original:";
      const object_div = document.getElementById("object_div");
      var elem = document.createElement("img");
      elem.setAttribute("src", result.info.secure_url);
      elem.setAttribute("width", "90%");
      elem.setAttribute("id","original");
      elem.style.marginLeft = "15px";
      document.getElementById("orig_div").appendChild(elem);
      document.getElementById("orig_div").style.display = "inline";
      document.getElementById("hiddenForm").style.display = "inline";
      var orig_url = document.createElement("p");
      var node = document.createTextNode("Delivery URL: "+result.info.secure_url);
      orig_url.appendChild(node);
      document.getElementById("orig_div").appendChild(orig_url);
      orig_url.style.marginLeft = "15px";
      
      const objects = [];
      const tagsObject = result.info.info.detection.object_detection.data.unidet.tags;
      const tagNames = Object.keys(tagsObject);
   
      


      for (let i=0; i<tagNames.length; i++){
        
        if (tagNames[i] != "furniture" && tagNames[i] != "girl" && tagNames[i] != "spectacles" && tagNames[i] != "necktie" && tagNames[i] != "man" && tagNames[i] != "woman" && tagNames[i] != "boy" && tagNames[i] != "human-face" && tagNames[i] != "person"){
          objects.push(tagNames[i]);

        }
      }
      if (objects.length==0){
        alert("We couldn't detect any objects. Try uploading a new file that contains more objects.");
        window.location.reload();
      }
      else{
        var intro = document.createElement('h3');
        intro.textContent = 'Our content aware add-on identified these objects in your image:';
        object_div.appendChild(intro);
        
        if (objects.length > 9) {
          num_objects = 9;
        } else {
          num_objects = objects.length;
        }
        for (let i = 0; i < num_objects; i++) {

          // creating checkbox element
          var checkbox = document.createElement('input');

          // Assigning the attributes
          // to created checkbox
          checkbox.type = "checkbox";
          checkbox.name = "objects";
          checkbox.value = objects[i];
          checkbox.id = objects[i];


          // creating label for checkbox
          var label = document.createElement('label');

          // assigning attributes for 
          // the created label tag 
          label.htmlFor = objects[i];
          label.style.minWidth = "100px";
          label.style.marginRight = "5px";
          // appending the created text to 
          // the created label tag 
          label.appendChild(document.createTextNode(objects[i]));

          // appending the checkbox
          // and label to div
          object_div.appendChild(checkbox);
          object_div.appendChild(label);
          if (i==2 || i==5){
            const line_break=document.createElement("div");
            line_break.style.width="100%";
            object_div.appendChild(line_break);
          }
        }
        document.getElementById("upload_widget").style.display = "none";

        document.getElementById("upload_instruct").style.display = "none";
        
        document.getElementById("obj_instructions").style.display = "none";
      }
    if (objects.length==1){
        alert("We only detected one object. Play around with recolor, then try uploading a new file that contains more objects.");
      }
    }
    else{
      alert("Please upload a PNG or JPG.");
      window.location.reload();
    }
  }
  else{
      alert("Your image didn't pass moderation.");
      window.location.reload();
    }
  }
}

);

document.getElementById("upload_widget").addEventListener(
"click",
function () {
  myWidget.open();
},
false
);

const handleSubmit = (event)=> {
  event.preventDefault();

  var elements = document.getElementById("choices").elements;
  const objects=[];
  for (let i = 1; i < elements.length; i++) { 
    if (elements[i].checked){
      objects.push(elements[i].value);
    }
  }
  if (objects.length==0){
    alert("Please select at least one object");
  }
  else{
    var prompt="";
    var temp="";
    for (let j = 0; j < objects.length; j++) {
      if (j==0){
        prompt=objects[j]+";";
      }
      else{
        temp=prompt;
        prompt=temp+objects[j]+";";

      }
    }
    prompt = prompt.slice(0, -1);
    var url = document.getElementById("original").src;
    var color=elements[0].value.substring(1);
    var place=url.indexOf("upload/", 1)+7;
    var transformation=url.slice(0, place) +"e_gen_recolor:prompt_("+prompt+");to-color_"+color+";multiple_true/"+ url.slice(place);
    document.getElementById("transform_div").style.display = "inline";
    document.getElementById("transform_heading").innerHTML = "Recolored:";
    //var elem = document.createElement("img");
    //elem.setAttribute("src", transformation);
    //elem.setAttribute("width", "80%");

    // Show the spinner
    document.getElementById("spinner").style.display = "block";
    document.getElementById("transform_img").style.display="none";

    // Use the load event to hide the spinner after the image has loaded
    var img = new Image();
    img.onload = function () {

          document.getElementById("transform_img").style.display="block";
          // Hide the spinner
          document.getElementById("spinner").style.display = "none";
          // Set the source of the transform_img
          document.getElementById("transform_img").src = transformation;
          document.getElementById("transform_url").innerHTML = "Transformation URL:"+"<br/>"+transformation;
          document.getElementById("transform_url").style.width="90%";
      
      };
    img.src = transformation;
    document.getElementById("transform_img").src=transformation;    
    //document.getElementById("transform_div").appendChild(elem);
    for (let i = 1; i < elements.length; i++) { 
      if (elements[i].checked){
        document.getElementById(elements[i].value).checked = false;
      }
    }
  }
}
