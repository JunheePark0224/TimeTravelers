const axios = require('axios');

const BLS_API_KEY = process.env.BLS_API_KEY;

// BLS API 기본 함수
const getBLSData = async (seriesIds, startYear, endYear) => {
  const response = await axios.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
    registrationKey: BLS_API_KEY,
    seriesid: seriesIds,
    startyear: startYear,
    endyear: endYear
  });

  return response.data;
};

// 우리가 price.js에서 쓸 함수
const getBLSPrices = async (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const seriesIds = {
    milk: 'APU0000709112',   // 우유 1갤런
    bread: 'APU0000702111',  // 식빵 1파운드
    egg: 'APU0000708111',    // 계란 1 dozen
    beef: 'APU0000703111'    // 소고기 1파운드
  };

  const result = await getBLSData(Object.values(seriesIds), year, year);
  const prices = {};

  result.Results.series.forEach((series) => {
    const itemKey = Object.keys(seriesIds).find(key => series.seriesID === seriesIds[key]);
    const monthlyData = series.data.find(item => item.period === `M${month}`);
    if (itemKey && monthlyData) {
      prices[itemKey] = parseFloat(monthlyData.value);
    }
  });

  return prices;
};

module.exports = { getBLSData, getBLSPrices };
