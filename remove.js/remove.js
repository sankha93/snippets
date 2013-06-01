/**
 * Copyright (C) 2013 Girish Sharma <scrapmachines@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Author:
 *   Girish Sharma <scrapmachines@gmail.com>
 */

(function (root, factory) {
  'use strict';

  // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
  // Rhino, and plain browser loading.
  if (typeof define === 'function' && define.amd) {
      define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
      factory(exports);
  } else {
      factory((root.remove = {}));
  }
}(this, function (exports) {

  var options = {};
  // Function to use isGibberish and remove redundant text
  function gibberish(aValue, aOptions) {
    options = aOptions || {
      comparison : "",
      whiteList : []
    };
    var partsLength = aValue.split(/[ _=]+/g).length,
        result = isGibberish(aValue),
        length = result.length,
        COEFF_LENGTH_MIN = options.COEFF_LENGTH_MIN || 0.5,
        COEFF_LENGTH_MAX = options.COEFF_LENGTH_MAX || 0.75;
    if (result + "" == "true" ||
        (length >= COEFF_LENGTH_MIN*partsLength && partsLength < 5) ||
        (length >= COEFF_LENGTH_MAX*partsLength && partsLength >= 5)) {
      var comparison = options.comparison || "";
      if (comparison.split(/[\/]/g).length > 3) {
        return aValue;
      }
      return removeRedundantText(aValue, comparison.split(/[\/]/g));
    }
    else if (result + "" != "false" && result + "" != "true" &&
             ((length < 0.6*COEFF_LENGTH_MIN*partsLength ||
               aValue.indexOf("=") < 0 &&
               length <= COEFF_LENGTH_MIN*partsLength) &&
              partsLength <= 8 ||
              length < 0.75*COEFF_LENGTH_MIN*partsLength &&
              partsLength > 8)) {
      return aValue.split(/[ _]/g).filter(function (part, i) {
        return result.indexOf(i) < 0;
      }).join(" ");
    }
    return aValue;
  }

  // Function to detect isGibberish words or words containing gibberish part
  function isGibberish(aValue) {
    // Returns false for non gibberish word, but for partial gibberish words
    // returns the output as an array of each gibberish word's index
    // Returns true/false for single words
    var parts = aValue.split(/[ _]/g),
        partLength = parts.length;
    if (partLength > 1) {
      // code to deterimine if the word is isGibberish on the whole
      var result = 0,
          partResult = 0,
          isGibberishIndexArray = [];
      for (var i = 0; i < partLength; i++) {
        partResult = isGibberish(parts[i]) == true ? 1 : 0;
        result += partResult;
        if (partResult == 1) {
          isGibberishIndexArray.push(i);
        }
      }
      return result == 0 ? false : isGibberishIndexArray;
    }
    else if (aValue.split(".").length > 1 && aValue.split(".").length < 4) {
      return isGibberish(aValue.replace(".", " ")) == false ? false : true;
    }
    else {
      // Returning false if url type thing encountered
      if (aValue.indexOf("/") >= 0) {
        return false;
      }
      // Array containing WhiteList Words
      // Populate it regularily
      var whiteList = ["http","https","id","aurora", "xpcom", "hawaii", "src",
                       "sdk", "string"];
      whiteList.push.apply(options.whiteList);
      // code to determine if a single word is isGibberish or not
      var numAlpha = 0, // Basically non numeric characters
          numNum = 0,
          numVowel = 0,
          isPartGibberish = false;
      aValue = aValue.toLowerCase();
      var length = aValue.length;
      numAlpha = aValue.split(/[^0-9]/).length -1;
      numNum = length - numAlpha;
      if (length < 6 && numAlpha <= 2) {
        return false;
      }
      else if (length >= 6 &&
               ((numAlpha > 2 && numNum > 0 && numAlpha < length - 1) ||
                (numAlpha == 0))) {
        return true;
      }
      numVowel = aValue.split(/[aeiouyаеёиоуыэюяAЕЁИОУЫЭЮЯ]/).length - 1;
      if (numVowel > 1) {
        aValue.split(/[aeiouyаеёиоуыэюяAЕЁИОУЫЭЮЯ]/).some(function(item) {
          if (isGibberish(item)) {
            isPartGibberish = true;
            return true;
          }
        });
      }
      if (numNum <= 2 && aValue.split(/[0-9]/g).length <= 2 &&
          ((length < 6 && numVowel > 0 && !isPartGibberish) ||
           (length >= 6 && numNum <= 2 && numVowel > 0 && !isPartGibberish &&
            numAlpha/numVowel < 5 && numAlpha/numVowel > 1.5))) {
       return false;
      }
      else if (whiteList.indexOf(aValue.toLowerCase()) >= 0) {
        return false;
      }
      return true;
    }
  }

  // Function to remove redundant text from String as per Title
  function removeRedundantText(aGib, aBase) {
    aGib = aGib.split(/\s+/);
    aBase = (aBase || []).filter(function(redVal) {
      return redVal.length > 3 || redVal.match(/[0-9]+/);
    });
    var i = 0, len, baseLen = aBase.length;
    function isBM(base) {
      if (base == aGib[i + 1] || base == aGib[i + 2]) {
        return true;
      }
      base = base.toLowerCase()
                 .replace(/[^0-9a-zA-Z\u0400-\u04FF\u0500-\u052F]+/g, "");
      for (var j = 0; j < baseLen; j++) {
        try {
          if (base.search(aBase[j]) >= 0 || aBase[j].search(base) >=0) {
            return true;
          }
        } catch (ex) {}
      }
      return false;
    }

    aBase = aBase.map(function(item) {
      return item.toLowerCase()
                 .replace(/[^0-9a-zA-Z\u0400-\u04FF\u0500-\u052F]+/g, "");
    });

    i = 0;
    var length = aGib.length;
    while (i < length) {
      if (isBM(aGib[i]) &&  (i < 2 || i > Math.max(length - 3, 0.75*length))) {
        aGib.splice(i, 1);
        i = 0;
        length = aGib.length;
      }
      else {
        i++;
      }
    }

    // Loop to reduce ending extra words like A , The , : , - etc
    len = aGib.length;
    i = 0;
    while (i < len) {
      aGib[i] = aGib[i].replace(/[^a-zA-Z0-9\u0400-\u04FF\u0500-\u052F]+$/, '')
                       .replace(/^[^a-zA-Z0-9\u0400-\u04FF\u0500-\u052F]+/, '');
      if (((i == 0 || i == len - 1) &&
           aGib[i].search(/^[^a-zA-Z0-9\u0400-\u04FF\u0500-\u052F]+$/) >= 0) ||
          (i == len - 1 && aGib[i].search(/^(the|a|an|for)$/i) >= 0)) {
        aGib.splice(i, 1);
        i = Math.max(i - 2, 0);
        len = aGib.length;
      }
      else {
        i++;
      }
    }
    return aGib.filter(function(v) {return v.length}).join(" ");
  }

  // function to trim the word and add … in the middle
  function trimWord(trimVal, limit, start) {
    if (trimVal == null) {
      return null;
    }
    function totalLength(parts) {
      var result = 0;
      for (var i = 0; i < parts.length; i++) {
        result += parts[i].length + 1;
      }
      return --result;
    }
    limit = limit || 40;
    var remWords = limit;
    if (start == null) {
      start = true;
    }

    if (trimVal.length > limit) {
      var valPart = trimVal.split(" "),
          newVal = "";
      if (valPart.length > 1) {
        var index = -1;
        Array.some(valPart, function(v) {
          if (newVal.length > 2*limit/3) {
            return true;
          }
          else {
            if (newVal.length + v.length < 2*limit/3) {
              newVal += v + " ";
              remWords -= (v.length + 1);
              index++;
            }
            else {
              return true;
            }
          }
        });
        if (index == -1) {
          // Checking whether the rest of the words (except first) sum up big
          var tempLim = valPart[0].length/totalLength(valPart);
          newVal = trimWord(valPart[0], limit*tempLim, true) + " ";
          remWords -= newVal.length;
          index++;
        }
        if (valPart.length > 2) {
          newVal += "… ";
          remWords -= 2;
        }
        if (index < valPart.length - 1) {
          // Now adding the remaining words till limit is completed
          var lastIndex = valPart.length - 1,
              endPart = "";
          while (remWords > valPart[lastIndex].length && lastIndex > index) {
            endPart = " " + valPart[lastIndex] + endPart;
            remWords -= (valPart[lastIndex--].length + 1);
          }
          if (lastIndex - index <= 1) {
            newVal = newVal.replace(" … ", " ");
            remWords += 2;
          }
          if (lastIndex > index && remWords > 2) {
            endPart = trimWord(valPart[lastIndex], remWords, false) + endPart;
          }
          newVal += endPart;
        }
        return newVal;
      }
      else if (start == false) {
        return "…" + trimVal.slice(trimVal.length - limit + 1, trimVal.length);
      }
      else if (start == true) {
        return trimVal.slice(0, limit-1) + "…";
      }
    }
    return trimVal;
  }

  if (typeof $ !== "undefined" && !!$.fn) {
    $.fn.rG = $.fn.removeGibberish = function(options) {
      var opts = $.extend({
        whiteList: [],  // Array of strings which you feel should not be
                        // considered gibberish ever.
        COEFF_LENGTH_MIN: 0.5, // Coefficient when the number of words in the
                               // string are less than 5
        COEFF_LENGTH_MAX: 0.75 // Coefficient when the number of words in the
                               // string are greater than equal to 5
      }, options);
      return $(this).map(function() {
        return gibberish(this, opts);
      });
    };

    $.fn.rR = $.fn.removeRedundant = function(comparison) {
      return $(this).map(function() {
        return removeRedundantText(this, comparison || []);
      });
    };

    $.fn.rC = $.fn.removeCharacters = function(limit, start) {
      return $(this).map(function() {
        return trimWord(this, limit, start);
      });
    };
  }

  exports.gibberish = gibberish;
  exports.redundant = removeRedundantText;
  exports.characters = trimWord;
  return exports;
}));
