const Constants = {};

Constants.TOOLS = {
  WATERING_CAN: {
    energy: 0.5,
  },
  SHEARS: {
    energy: 1,
  },
};

Constants.TOTAL_VIP_ENERGY_PER_DAY = 400 * 3;

Constants.ENERGY_SOURCE = [
  Constants.TOTAL_VIP_ENERGY_PER_DAY, //400 * 3 VIP ROCK
  240, //240 * 1 hour POOL BATH
  482.4, //1440 / 2 = 720   ×  0.67 (0.67 every 2 minutes passive regen)
];

Constants.TOTAL_ENERGY_PER_DAY = Constants.ENERGY_SOURCE.reduce(
  (a, b) => a + b,
  0
);

export default Constants;
