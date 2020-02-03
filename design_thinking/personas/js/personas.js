/* filename: personas.js
 * author: Glenn Abastillas
 * created: January 16, 2020
 * description: This jscript contains code for the functionality of the
 * personas.html page to allow users to create and save multiple personas
 *
 */

 // Global Variables

 var PERSONAS = {};
 var DEFAULTS = {name: {placeholder: 'Name'},
                 title: {placeholder: 'Title'},
                 goals: {placeholder: 'Goals'},
                 description: {placeholder: 'Description'},
                 url: {placeholder: 'Link to image'}};

 var NAMES = ['Avery', 'Riley', 'Reese', 'Sasha',
              'Quinn', 'Blake', 'Taylor',
              'London', 'Charlie', 'Emerson',
              'Alex', 'Jaden', 'Skyler', 'Toni',
              'Aiden', 'Sam', 'Chris', 'Dana'];

var TITLES = ['Researcher', 'Technician',
              'Layperson', 'Registrar', 'Student',
              'Programmer', 'Scientist', 'Director'];

 $(document).ready(function(){
    // Set up drag and drop events for drop areas
    var obj = {draggable: true,
               ondragstart: "drag(event)"};
    var area = {ondrop: "drop(event)",
               ondragover: "allowDrag(event)"};
    var all = $("div #image-text");

    all.each(function(){
        for (key in area){
            $(this).attr(key, area[key]);
        }
    });

    // Set default draggable object properties
    for (key in obj){
        $("img").attr(key, obj[key]);
    }

    // Set default values for text fields
    for (key in DEFAULTS){
        var tag = "#" + key;
        var attr = DEFAULTS[key];
        $(tag).attr(attr);
    }


    for (var i = 0; i < 8; i++){
        var current_image = './img/person' + i + '.jpg';
        addDefaultPersona(current_image);
    }
    setUpEventListeners();
 })


 function setUpEventListeners(){
    // Add event listeners to all tags

    var events = {"#save" : {onclick : 'save()'},
                  "#load" : {onclick : 'load()'},
                  "#clear" : {onclick : 'clearAll()'},
                  "#clear-personas" : {onclick : 'clearPersonas()'},

                  "#goals" : {onfocusout : 'formatGoals()'},
                  "#url" : {onfocusout : 'udpateAvatar()'},

                  ".default-persona" : {draggable : 'true',
                                        ondragstart : 'drag(event)'},

                  "#show-default-avatars" : {onclick : 'togglePersonaSelectionPane()',
                                             title : "Click to hide default avatars"},

                  "#persona-avatar" : {ondrop : 'drop(event)',
                                       ondragover : 'allowDrag(event)'},

                  "#download" : {onclick : 'downloadPersona()'},
                  "#download-json" : {onclick : 'downloadPersona("json")'}
                  };

    for (key in events){
        $(key).attr(events[key]);
    }
 }

 function clearAll(){
    /* Clear all input and text areas. */
    $("input").val("");
    $("textarea").val("");
    $("textarea").text("");
    udpateAvatar();
    $("#persona-selection-pane").css({opacity : 0});
    $('#show-default-avatars').css({background : "#afcf93"});
 }

 function formatGoals(){
    /* Add a bullet in front of each goal specified */

    var goals = $("#goals");
    var goals_list = goals.val().split("\n");
    var bullet = String.fromCodePoint(8226) + " ";
    var newgoals = "";

    for (goal of goals_list){
        if (goal != ""){
            goal = goal.replace(bullet, "");
            newgoals += bullet + goal + "\n";
        }
    }
    goals.val(newgoals);
 }

 function udpateAvatar(){
    /* Load Avatar specified in a URL */
    var url = $("#url").val();
    var avatar = $("#persona-avatar");

    $(avatar).empty();

    if (url != ""){
        // Set img window to specified URL
        var img = document.createElement("img");
        var attr = {id : "avatar",
                    src : url,
                    onclick : "hidePersonaSelectionPane()"};
        $(img).attr(attr);
        $(avatar).append(img);
    } else {
        // Clear avatar image tag
        var div = document.createElement("div");
        $(div).attr("id", "persona-selection-pane");
        $(avatar).append(div);
    }
 }

 function clearPersonas(){
    /* Clear list of saved personas */
    PERSONAS = {};
    $("#navigation-personas").empty();
    updateList();
    clearAll();
 }

 function loadPersona(name){
    /* Load an existing person if it exists in the PERSONAS object
     *
     * Parameters
     * ----------
     *      name (str): Name of persona to load onto screen
     */
     var nameInKeys = false;

     $.each(PERSONAS, function(k, v){
        // Loop through each k and see if name is in keys
        if (k.toLowerCase() == name.toLowerCase()){
            nameInKeys = true;
        }
     });

     if (nameInKeys != true){
        alert("Persona not found");
        return 0;
     }

     var persona = PERSONAS[name];

     $("#name").val(persona.name);
     $("#title").val(persona.title);
     $("#url").val(persona.url);
     $("#description").val(persona.description);
     $("#goals").val(persona.goals);
     udpateAvatar();
 }


 function createPersona(){
    /* Create a persona object to be stored in the Personas object */
    var name = $("#name").val();
    var title = $("#title").val();
    var persona = {name : name,
                   title : title,
                   description: $("#description").val(),
                   goals : $("#goals").val(),
                   url : $("#url").val()};
    PERSONAS[name+title] = persona;
 }


 function addDefaultPersona(src){
    /* Create a circle icon for a specified default persona
     *
     * Parameters
     * ----------
     *      src (str) : Path to image to load
     */
    var img = document.createElement("img");
    var div = document.createElement("div");
    var title = src.split("/");

    title = title[title.length - 1].replace(".", "-");

    var int = Math.floor(Math.random() * (NAMES.length - 1));
    var name = NAMES[int];

    $(div).attr({class : 'default-persona'});
    $(img).attr({class : 'default-persona',
                 title : name,
                 src : src,
                 id : name + "-" + title});

    $(div).append(img);
    $('#persona-selection-pane').append(div);
 }


 function togglePersonaSelectionPane(){
    // Toggle show and hide for Persona Selection Pane
    var opacity = $('#persona-selection-pane').css('opacity');
    if (opacity == 0){
        $('#persona-selection-pane').css({opacity : 1});
        $('#show-default-avatars').css({background : "#e3b6ac"});
    } else {
        $('#persona-selection-pane').css({opacity : 0});
        $('#show-default-avatars').css({background : "#afcf93"});
    }
 }


 function save(object){
    /* Save persona details entered in Name and Job, Description, and Goals
     * sections. Create a file using the persona name as the filename.
     *
     * Parameters
     * ----------
     *      object ---
     *
     * Output
     * ------
     *      Persona as a text file with the extension txt.
     *      The text file has the following structure:
     *          - name:
     *          - occupation:
     *          - description:
     *          - goals:
     */

    // var div = document.getElementById("personas-current");
    var currentPersonas = $("#navigation-personas");
    var currentText = currentPersonas.text();

    if (currentText == "No personas defined yet"){
        currentText = "";
    }

    var name = $("#name").val();
    var title = $("#title").val();

    // Escape if name and job are blank
    if (name == "" || title == ""){
        return 0;
    } else {
        createPersona();
    }

    // Create a new list item if the and job are not blank
    if (name != ""){
        updateList();
    }
 }


 function updateList(){
    /* Update the current list of personas with data from PERSONAS */

    var current = $("#navigation-personas");
    current.empty();

    $.each(PERSONAS, function(k, v){

        var uid = v.name + "-" + v.title;
        var class_ = "saved-persona";
        var onclick = "loadPersona('" + v.name + v.title + "')";

        var attr_div = {name : uid, class : class_};
        var attr_img = {id : uid,
                        src : v.url,
                        onclick : onclick};

        var icon = document.createElement("div");
        var image = document.createElement("img");

        $(image).attr(attr_img);
        $(icon).attr(attr_div);

        icon.append(image);
        current.append(icon);
    });
 }


function downloadPersona(as="text"){
   // Download textarea content as a JSON object
   // This is downloading the content as a text file, not saving as
   // a JSON object.
   var date = new Date();
   var prefix = "" + date.getFullYear() + (date.getMonth() + "1") + date.getDate();
   var filename = prefix + "_personas";

   if (as.toLowerCase() == "json"){
        var content = JSON.stringify(PERSONAS, null, 2);
        var type = {type : "text/json;charset=utf-8"};
        filename += ".json";
   } else {
        var content = 'Personas\nCreated:' + prefix + "\n\n";
        var type = {type : "text/plain;charset=utf-8"};
        filename += ".txt";

        for (key in PERSONAS){
            var persona = PERSONAS[key];

            content += persona.name + ", " + persona.title + "\n";
            content += "Description: " + persona.description + "\n";
            content += "Goals:\n\n" + persona.goals;
            content += "\n\n";
        }
   }

   var link = document.createElement("a");
   var blob = new Blob([content], type);

   link.href = URL.createObjectURL(blob);
   link.download = filename;
   link.click();
}


function load(name="test.json"){
    // $.getjson(name, function(name){
    //     alert(name);
    //     console.log(name);
    // });
}


 /* - - - - - - - - - - - - - - - - - - - - - - - - - -*/
 /* Functions to enable drag and drop in the document. */
 /* - - - - - - - - - - - - - - - - - - - - - - - - - -*/

 function allowDrag(ev){
    // Disable the default browser behavior for a draggable event.
    ev.preventDefault();
 }

 function drag(ev){
    // Set an object to a data transfer variable.
    ev.dataTransfer.setData("text", ev.target.id);
 }

 function drop(ev){
    // Enable a drop area to react to a dropped object
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var avatar = $("#" + data);

    clearAll();

    var url = avatar.attr("src");
    var name = avatar.attr("id").split("-")[0];
    var title = TITLES[Math.floor(Math.random() * TITLES.length)];

    $("#url").val(url);
    $("#name").val(name);
    $("#title").val(title);
    udpateAvatar();
 }
