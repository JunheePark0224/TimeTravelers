const express = require('express');
const router = express.Router();
const axios = require('axios');

const getExchangeRates = async (date) => {
  const res = await axios.get(`https://api.frankfurter.app/${date}`, {
    params: {
      from: 'USD',
      to: 'KRW,EUR,JPY'
    }
  });

  const rates = res.data.rates;
  return {
    USD_KRW: rates.KRW,
    USD_EUR: rates.EUR,
    USD_JPY: rates.JPY
  };
};


// 🥛 소비자물가 데이터 (단위: USD 또는 USD/pound 등)
const getConsumerPrices = async (date) => {
  return {
    milk: 2.83,       // 우유 1갤런
    bread: 0.319,     // 식빵 1파운드
    egg: 2.812,       // 계란 1 dozen
    beef: 2.152       // 소고기 1파운드
  };
};

router.get('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const exchangeRates = await getExchangeRates(date);
    const prices = await getConsumerPrices(date);

    res.json({
      date,
      exchangeRates,
      consumerPrices: prices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price data'
    });
  }
});

module.exports = router;
