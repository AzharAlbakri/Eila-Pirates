//Count smiley faces
exports.countSmileys = function(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length === 3) {
        if (
          (arr[i][0] === ";" || arr[i][0] === "8") &&
          (arr[i][1] === "-" || arr[i][1] === "~") &&
          (arr[i][2] === ")" || arr[i][2] === "|")
        ) {
          count += 1;
        }
      } else if (arr[i].length === 2) {
        if (
          (arr[i][0] === ";" || arr[i][0] === "8") &&
          (arr[i][1] === ")" || arr[i][1] === "|")
        ) {
          count += 1;
        }
      }
    }
    return count;
  }

   