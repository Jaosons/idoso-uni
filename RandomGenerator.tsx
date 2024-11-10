export const RandomLocation = () => {
  let latMin = -22;
  let latMax = -20;
  let lonMin = -50;
  let lonMax = -45; 
  const x = ((Math.random() * (latMax - latMin)) + latMin).toFixed(6); 
  const y = ((Math.random() * (lonMax - lonMin)) + lonMin).toFixed(6); 
  return ({
    x, 
    y
  });
};

export const RandomTimestamp = () => {
  const minDate = new Date('2020-01-01').getTime();
  const maxDate = new Date('2025-01-01').getTime();
  const randomTimestamp = Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate;

  return randomTimestamp;
};

export const RandomHeartRate = () => {
  const max = 100
  const min = 60

  const heartRate1 = Math.floor(Math.random() * (max - min + 1)) + min
  const heartRate2 = Math.floor(Math.random() * (max - min + 1)) + min
  const heartRate3 = Math.floor(Math.random() * (max - min + 1)) + min

  const heartRates = [heartRate1, heartRate2, heartRate3];

  let maxRate = Math.max(...heartRates);
  let minRate = Math.min(...heartRates);
  let avg = (minRate + maxRate) / 2;

  if (maxRate < minRate) {
    [maxRate, minRate] = [minRate, maxRate];
  }
  return {
    avg,
    max: maxRate,
    min: minRate,
  };
};
