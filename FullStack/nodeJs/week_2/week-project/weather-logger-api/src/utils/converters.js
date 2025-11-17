function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function convertTemperature(value, units) {
  if (units === "imperial") {
    return parseFloat(celsiusToFahrenheit(value).toFixed(2));
  }
  return parseFloat(value.toFixed(2));
}

function convertObservation(observation, units) {
  if (units === "metric") return observation;

  return {
    ...observation,
    tempC: convertTemperature(observation.tempC, units),
    tempUnit: "°F",
  };
}

function formatDateWithTimezone(dateString, timezone) {
  if (!timezone) return dateString;

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

module.exports = {
  celsiusToFahrenheit,
  convertTemperature,
  convertObservation,
  formatDateWithTimezone,
};
