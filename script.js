const getLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const ip = data.ip;
    
    console.log(ip);
    

    //showing ip on ui
    const ipAddrElem = document.querySelector("#ip-address");
    ipAddrElem.innerHTML = `<h2>My Public Ip is : <b>${ip}</b></h2>`




    const pincode = data.postal;
    console.log(pincode);
//pincode
    let displayPincode=document.getElementById('pincode');
    displayPincode.textContent=`Pincode: ${pincode}`;
//latitude & longitude 
    const latLongResponse = await fetch(`https://ipapi.co/${ip}/latlong/`);
    const latLongData = await latLongResponse.text();
    const [latitude, longitude] = latLongData.split(",");
    console.log(latitude, longitude);

    let lat=document.getElementById('lat');
    lat.textContent=`Lat: ${latitude}`;

    let long=document.getElementById('long');
    long.textContent=`Long: ${longitude}`;
//city
      let citys=data.city;
      let city=document.getElementById('city');
      city.textContent=`City:  ${citys}`;


      //region


      let regions=data.region;
      let region=document.getElementById('region');
      region.textContent=`Region:  ${regions}`;

    


    const timezoneResponse = await fetch(`https://ipapi.co/${ip}/timezone/`);
    const timezone = await timezoneResponse.text();
    console.log(timezone);

//timezone
    let displayTime=document.getElementById('timezone');
    displayTime.textContent=`Time Zone: ${timezone}`;


    let time = new Date().toLocaleString("en-US", { timeZone: timezone });
    console.log(time);
    let Time=document.getElementById('date');
    Time.textContent=`Date And Time: ${time}`;
    
    //making postal elements visible
    let visible = document.getElementById("posts");
    visible.style.display = "block";

    //making info visible

    let information=document.getElementById('info-container');
    information.style.display="flex";

    

    // fetching postal details
    const postOfficeDetails = await getPostalDetails(pincode);
    console.log(postOfficeDetails);
    console.log(postOfficeDetails.Message)
    let Message=document.getElementById('message');
    Message.textContent=`Message: ${postOfficeDetails.Message}`;
    

    if (postOfficeDetails.Status === "Success") {
      const postOfficeList = document.getElementById("post-offices");
      postOfficeList.innerHTML = ""; // Clear the list

      showPostOffice(postOfficeDetails.PostOffice);
      
    } else {
      console.log(postOfficeDetails.Message);
    }

    
    // const postOfficesElement = document.getElementById("message");
    // postOfficesElement.innerHTML = `Post offices found: ${postOfficeDetails.length}`;

    const mapFrame = document.getElementById("map-frame");
    mapFrame.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  } catch (error) {
    console.log(error);
  }
};

const getPostalDetails = async (pincode) => {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.log(error);
  }
};

const showPostOffice = (postOfficeArr) => {
  const postOfficeList = document.getElementById("post-offices");
  postOfficeList.innerHTML = ""; // Clear the list

  postOfficeArr.forEach((postOffice) => {
    const postOfficeDiv = document.createElement("div"); // Create a new div for each post office
    postOfficeDiv.classList.add("post-office"); // Add the "post-office" class to the div

    const nameDiv = document.createElement("div"); // Create a new div for the name
    nameDiv.innerHTML = `<strong>Name:</strong> ${postOffice.Name}`;
    postOfficeDiv.appendChild(nameDiv);

    const branchDiv = document.createElement("div"); // Create a new div for the branch type
    branchDiv.innerHTML = `<strong>Branch Type:</strong> ${postOffice.BranchType}`;
    postOfficeDiv.appendChild(branchDiv);

    const deliveryDiv = document.createElement("div"); // Create a new div for the delivery status
    deliveryDiv.innerHTML = `<strong>Delivery Status:</strong> ${postOffice.DeliveryStatus}`;
    postOfficeDiv.appendChild(deliveryDiv);

    const districtDiv = document.createElement("div"); // Create a new div for the district
    districtDiv.innerHTML = `<strong>District:</strong> ${postOffice.District}`;
    postOfficeDiv.appendChild(districtDiv);

    const divisionDiv = document.createElement("div"); // Create a new div for the division
    divisionDiv.innerHTML = `<strong>Division:</strong> ${postOffice.Division}`;
    postOfficeDiv.appendChild(divisionDiv);

    postOfficeList.appendChild(postOfficeDiv);
  });

  postOfficeList.classList.add("post-offices"); // Add the "post-offices" class to the ul element
};

//making button visible

search.addEventListener("input", () => {
  const searchTerm = search.value.trim().toLowerCase();
  const filteredPostOffices = postOfficeArr.filter((postOffice) => {
    return (
      postOffice.Name.toLowerCase().includes(searchTerm) ||
      postOffice.BranchType.toLowerCase().includes(searchTerm)
    );
  });
  showPostOffice(filteredPostOffices);
});

let btn = document.getElementById("btn");
btn.addEventListener("click", getLocation);

let postOfficeArr = [];

const fetchPostOffices = async () => {
  try {
    const response = await fetch("https://api.postalpincode.in/pincode/110001");
    const data = await response.json();

    if (data[0].Status === "Success") {
      postOfficeArr = data[0].PostOffice;
    } else {
      console.log(data[0].Message);
    }
  } catch (error) {
    console.log(error);
  }
};

fetchPostOffices();
