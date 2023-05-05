const getLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const ip = data.ip;
    console.log(ip);
    const pincode = data.postal;
    console.log(pincode);

    const latLongResponse = await fetch(`https://ipapi.co/${ip}/latlong/`);
    const latLongData = await latLongResponse.text();
    const [latitude, longitude] = latLongData.split(",");
    console.log(latitude, longitude);

    const timezoneResponse = await fetch(`https://ipapi.co/${ip}/timezone/`);
    const timezone = await timezoneResponse.text();
    console.log(timezone);

    let time = new Date().toLocaleString("en-US", { timeZone: timezone });
    console.log(time);
    const mapFrame = document.getElementById("map-frame");
    mapFrame.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

    const postResponse = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const postman = await postResponse.json();
  console.log(postman);
  if(postman.Status==="Success")
  console.log("su");
  else 
  console.log("no")
    // if (postman[0].Status === "Success") {
    //   const postOfficeDetails = postman[0].PostOffice;
    //   console.log(postOfficeDetails);

    //   const postOfficeList = document.getElementById("post-offices");
    //   postOfficeList.innerHTML = ""; // Clear the list

    //   postOfficeDetails.forEach((postOffice) => {
    //     const li = document.createElement("li");
    //     li.textContent = `${postOffice.Name}, ${postOffice.Block}, ${postOffice.District}, ${postOffice.State}, ${postOffice.Pincode}`;
    //     postOfficeList.appendChild(li);
    //   });
    // } else {
    //   console.log(postman[0].Message);
    // }
  } catch (error) {
    console.log(error);
  }
};

let btn = document.getElementById("btn");
btn.addEventListener("click", getLocation);
