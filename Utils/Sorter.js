function customSort(arr) {
  let sortedVals = arr.sort((a, b) => {
    if (typeof a === "string" && typeof b === "string") {
      // Sort strings in alphabetical order
      return a.localeCompare(b);
    } else if (typeof a === "number" && typeof b === "number") {
      // Sort numbers in ascending order
      return a - b;
    } else {
      // If types are different, prioritize sorting strings first
      return typeof a === "string" ? -1 : 1;
    }
  });
  console.log(sortedVals, "=====> sortedVals");
  return sortedVals;
}

module.exports = { customSort };
