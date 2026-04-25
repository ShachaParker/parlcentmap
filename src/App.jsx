import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Sphere } from "react-simple-maps"
import { csv } from "d3-fetch";
import './App.css'
import { Tooltip } from "react-tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

function continentColor(country, continent) {
  //console.log("COUNTRY", country, "CONTINENT", continent);
  if (country == "ATA") {
    return "#FFFFFF";
  }
  else if (country == "CAN") {
    return "#BB2F58FF";
  }
  else if (country == "RUS") {
    return "#CCCCCC";
  }
  else if (continent == "Americas") {
    return "#A78E5EFF"
  }
  else if (continent == "Europe") {
    return "#5F4C89FF";
  }
  else if (continent == "Africa") {
    return "#2E9797FF";
  }
  else {
    return "#B3268CFF";
  }
}

function regionContent(country, continent) {
  if (country == "CAN") {
    return ["https://parlcent.org/programs/canada/", "https://parlcent.org/wp-content/uploads/2025/04/479881652_18483442105041761_6705884644243386411_n.jpg"];
  }
  else if (country == "ATA") {
    return ["", ""];
  }
  else if (country == "RUS") {
    return ["", ""];
  }
  else if (continent == "Americas") {
    return ["https://parlcent.org/programs/americas/", "https://parlcent.org/wp-content/uploads/2024/11/americas-600x396-1.jpg"];
  }
  else if (continent == "Europe") {
    return ["https://parlcent.org/programs/europe-eurasia/", "https://parlcent.org/wp-content/uploads/2024/11/europe-600x371-1.jpg"];
  }
  else if (continent == "Africa") {
    return ["https://parlcent.org/programs/africa/", "https://parlcent.org/wp-content/uploads/2026/02/Parlliament-of-Kenya-in-Session.jpg"];
  }
  else if (continent == "Asia" || continent == "Oceania") {
    return ["https://parlcent.org/programs/asia/", "https://parlcent.org/wp-content/uploads/2025/01/bagan-zone-temple-view-1536x864.jpg"];
  }
  else {
    return ["", ""]
  }
}

function makeThreeDigit(num) {
  if (num < 100) {
    if (num < 10) {
      return "00" + num;
    }
    else {
      return "0" + num;
    }
  }
  else {
    return num;
  }
}

export default function MapChart() {
  const [regions, setRegion] = useState([]);

  useEffect(() => {
    csv(`/parlcentmap/continents.csv`).then((regions) => {
      setRegion(regions);
    });
  }, []);

  return (
    <>
      <ComposableMap>
        <Sphere stroke="#777777" strokeWidth={2} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const r = regions.find((c) => makeThreeDigit(c["country-code"]) === geo.id);
              let continent = r ? r.region : "Unknown";
              if (r && r.name === "Antarctica") {
                continent = "Antarctica";
              }
              else if (!r || r.region === "") {
                continent = "Unknown";
              }

              const regionID = r ? r.name : "Unknown Country";

              let regionSiteData = [];
              if (r) {
                regionSiteData = regionContent(r.name, r.region);
              }
              let clickMessage = "";
              if (regionSiteData[0] != "" && r) {
                if (r.name == "Canada") {
                  clickMessage = "Click here to go to Canada Program.";
                }
                else {
                  clickMessage = `Click here to go to the ${continent} Program.`;
                }
              }

              const tooltipContent = `
                <div>
                  <b>${regionID}</b>
                  <br>
                  <a href="${regionSiteData[0]}">${clickMessage}</a>
                  <br>
                  <img src="${regionSiteData[1]}" alt=" " style="width:200px;" />
                </div>
              `;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={r ? continentColor(r.alpha3, r.region) : "#CCCCCC"}
                  data-tooltip-id="country-tooltip"
                  data-tooltip-html={tooltipContent}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Tooltip id="country-tooltip" clickable={true} float={true} opacity={0.99} />
    </>
  );
}