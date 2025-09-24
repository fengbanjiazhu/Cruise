// module.exports = {
//   testEnvironment: "jsdom",
//   transform: {
//     "^.+\\.[jt]sx?$": "babel-jest",
//   },
//   moduleNameMapper: {
//     "\\.(css|less|scss|sass)$": "identity-obj-proxy",
//   },
//   transformIgnorePatterns: ["/node_modules/(?!(react-leaflet|@react-leaflet/core|leaflet)/)"],
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/Client/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["/node_modules/(?!(react-leaflet|@react-leaflet/core|leaflet)/)"],
};
