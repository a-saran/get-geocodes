const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const data = require("./data");

const url = location =>
  `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.API_KEY}`;

let Result = {};

const main = () => {
  const keys = Object.keys(data);

  keys.map(key => {
    Result = {
      ...Result,
      [key]: {
        districtData: {}
      }
    };

    const stateDistrictKeys = Object.keys(data[key]["districtData"]);

    stateDistrictKeys.map(async district => {
      const latLng = {
        lat: null,
        lng: null
      };

      await axios
        .get(url(district))
        .then(({ data: { results } }) => {
          // const {
          //   geometry: { location }
          // } = results[0];

          const geometry = results[0]["geometry"];

          latLng = geometry.location;
        })
        .catch(err => {
          console.log(err);
        });

      Result[key]["districtData"][district] = {};
      Result[key]["districtData"][district] = latLng;
    });
  });

  console.log(Result);

  fs.writeFileSync("./geoLocation.json", JSON.stringify(Result), "utf-8");
};

main();
