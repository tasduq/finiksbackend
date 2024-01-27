function isBase64(str) {
  // Regex to check if it's a Base64 image data URL
  const base64ImageRegex =
    /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/]+={0,2}$/;

  // Test the whole string against the Base64 image regex
  if (!base64ImageRegex.test(str)) {
    return false;
  }

  // Extract the Base64 data (strip off the data URL scheme)
  const base64Data = str.split(",")[1];

  // Regex for Base64 string validation
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  // Test the extracted Base64 data
  return base64Regex.test(base64Data);
}

module.exports = { isBase64 };
