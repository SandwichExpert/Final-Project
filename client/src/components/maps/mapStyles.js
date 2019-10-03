// const mapStyles = [
//   {
//     featureType: "landscape",
//     stylers: [
//       {
//         hue: "#FFBB00"
//       },
//       {
//         saturation: 43.400000000000006
//       },
//       {
//         lightness: 37.599999999999994
//       },
//       {
//         gamma: 1
//       }
//     ]
//   },
//   {
//     featureType: "road.highway",
//     stylers: [
//       {
//         hue: "#FFC200"
//       },
//       {
//         saturation: -61.8
//       },
//       {
//         lightness: 45.599999999999994
//       },
//       {
//         gamma: 1
//       }
//     ]
//   },
//   {
//     featureType: "road.arterial",
//     stylers: [
//       {
//         hue: "#FF0300"
//       },
//       {
//         saturation: -100
//       },
//       {
//         lightness: 51.19999999999999
//       },
//       {
//         gamma: 1
//       }
//     ]
//   },
//   {
//     featureType: "road.local",
//     stylers: [
//       {
//         hue: "#FF0300"
//       },
//       {
//         saturation: -100
//       },
//       {
//         lightness: 52
//       },
//       {
//         gamma: 1
//       }
//     ]
//   },
//   {
//     featureType: "water",
//     stylers: [
//       {
//         hue: "#0078FF"
//       },
//       {
//         saturation: -13.200000000000003
//       },
//       {
//         lightness: 2.4000000000000057
//       },
//       {
//         gamma: 1
//       }
//     ]
//   },
//   {
//     featureType: "poi",
//     stylers: [
//       {
//         hue: "#00FF6A"
//       },
//       {
//         saturation: -1.0989010989011234
//       },
//       {
//         lightness: 11.200000000000017
//       },
//       {
//         gamma: 1
//       }
//     ]
//   }
// ];

const mapStyles = [
  {
    featureType: "administrative",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "simplified"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [
      {
        visibility: "simplified"
      }
    ]
  },
  {
    featureType: "water",
    stylers: [
      {
        visibility: "simplified"
      }
    ]
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "simplified"
      }
    ]
  },
  {
    featureType: "landscape",
    stylers: [
      {
        visibility: "simplified"
      }
    ]
  },
  {
    featureType: "road.highway",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "road.local",
    stylers: [
      {
        visibility: "on"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        visibility: "on"
      }
    ]
  },
  {
    featureType: "water",
    stylers: [
      {
        color: "#84afa3"
      },
      {
        lightness: 52
      }
    ]
  },
  {
    stylers: [
      {
        saturation: -17
      },
      {
        gamma: 0.36
      }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#3f518c"
      }
    ]
  }
];

export default mapStyles;
