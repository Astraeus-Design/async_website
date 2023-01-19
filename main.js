const pcode='ne65 0jn';

let pcodeValue='';

/* template strings for URLs to have variables inserted */

let postcodeURL=`https://geocode.maps.co/search?postalcode=`;
let sunsetURL=`https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873`;
let astroURL=`http://www.7timer.info/bin/astro.php?lon=`;

/* references to DOM objects */

const buttonRef=document.querySelector("#searchButton");
const inputRef=document.querySelector("#inputText");
const imagedivRef=document.querySelector("#imageDiv");
const tbox1Ref=document.querySelector("#l1b");
const tbox2Ref=document.querySelector("#l2b");
const tbox3Ref=document.querySelector("#l3b");
const tbox4Ref=document.querySelector("#l4b");
const tbox5Ref=document.querySelector("#l5b");
const tbox6Ref=document.querySelector("#l6b");
const tbox7Ref=document.querySelector("#l7b");
const tbox8Ref=document.querySelector("#l8b");
const addText=document.querySelector("#addressText");




console.log(inputRef.value);

/* regex value for verifying postcode format */

let postcodeRegex=/([a-zA-Z]{1,2})+([0-9]{1})+([a-zA-Z0-9]{0,1}\s{1})+([0-9]{1})+([a-zA-Z]{2})/;

let locationData;   /* object of location data values */
let errorAPI=false; /* used for use when updating display fields */
let sunriseObj; /* object will contain sunrise data */
let astroObj;   /* will contain astro data or image */
let htmlString=``; /* use to populate image once data for location is obtained */


/* function to update screen components with acquired data */

function updateDisplay(locdata,sundata){

     /* populate text areas with required data */

     tbox1Ref.textContent=sunriseObj.sunrise;
     tbox2Ref.textContent=sunriseObj.sunset;
     tbox3Ref.textContent=sunriseObj.first_light;
     tbox4Ref.textContent=sunriseObj.last_light;
     tbox5Ref.textContent=sunriseObj.dawn;
     tbox6Ref.textContent=sunriseObj.dusk;
     tbox7Ref.textContent=sunriseObj.day_length;
     tbox8Ref.textContent=sunriseObj.timezone;
     addText.textContent=locationData.display_name;


}


/* function to act as button listener and call api's */

function buttonListener(){

    errorAPI=false;

    /* acquire value of input box */

    pcodeValue=inputRef.value;
    if (postcodeRegex.test(pcodeValue)){

        /* if postcode entered is valid then call API's in sequence by their success or failure */

        console.log("postcode accepted "+pcodeValue);

        /* replace space in postcode with a + symbol for use in GET request */

        console.log(pcodeValue.indexOf(' '));
        pcodeValue=pcodeValue.replace(/\s/,'+');
        console.log(pcodeValue);
        urlToCall=postcodeURL+`${pcodeValue}`;
        console.log(urlToCall);

        /* make a fetch call to first API, this checks postcode and returns location data required for the nest two API's in sequence */

        fetch(urlToCall).then((response)=>response.json()).then((outputVal)=>{
            /*console.log(outputVal);*/
            locationData=outputVal[0];
            console.log(locationData,locationData.lat,locationData.lon);


            /* undertake next fetch inside completed postcode API fetch */

            /* now lets acquire the sunrise/sunset data from another API */
        
           /* create URL from location data in locationData object */

           sunsetAPI=sunsetURL+`lat=${locationData.lat}&lng=${locationData.lon}`;

           /* now make the call to get data */

           fetch(sunsetAPI).then((response)=>response.json()).then((outputVal)=> {
               /*console.log(outputVal);*/
               console.log(outputVal.results);
               sunriseObj=outputVal.results;
               console.log(sunriseObj.sunrise,sunriseObj.timezone);
            
               /* we have an object containing key value pairs of sunrise and sunset related times */


               /* update display elements with acquired data */
               
               updateDisplay(locationData,sunriseObj);

               /* now we shall obtain the image containing the astro weather data */
                
                astroAPI=astroURL+`${locationData.lon}&lat=${locationData.lat}ac=0&lang=en&unit=metric&output=internal&tzshift=0`;

                htmlString=`<img src=${astroAPI} alt='No astro weather image data available id="astroimage'>`;

                imagedivRef.innerHTML=htmlString;
                
            /*    fetch(astroAPI).then((response)=>{console.log(response);response.json()}).then  ((outputVal)=> {
                    console.log(outputVal);
                    /*console.log(outputVal);*/
                    /*sunriseObj=outputVal.results;
                    console.log(sunriseObj.sunrise,sunriseObj.timezone);*/
             
                    /* we have an object containing key value pairs of sunrise and sunset related times */
 
                    /* now we shall obtain the image containing the astro weather data */
 
             /*   
 
                })
                .catch((err)=>{console.log(err);
                         errorAPI=2;
                         alert("Unable to acquire sunset/sunrise data, please try again")});  */                         

             })
             .catch((err)=>{console.log(err);
                        errorAPI=true;
                        alert("Unable to acquire astro weather data, please try again")});            
            

 
        })
        .catch((err)=>{console.log(err);
                        errorAPI=true;
                        alert("Unable to locate Postcode, please try again")});

 





    }
    else
    {
        alert("Please check entered Postcode");
    };
    
};


/* attach a listener to the postcode entry button */  

buttonRef.addEventListener('click',buttonListener);

if (!errorAPI){


};

