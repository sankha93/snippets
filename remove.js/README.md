# remove.js

*Small but powerful string cleanup and reduction library*

## Try it

It contains the following string manipulation methods:

- `remove.redundant` - To remove redundant words from a sentence
- `remove.gibberish` - To remove gibberish parts (or completely replace) from a sentence
- `remove.characters` - To intelligentally trim the sentence

The `remove.js` file contains the whole library.

## Install it

### Node

You can try to require it in node.

    var remove = require('remove');
    var string = "bmgbberish This is This is a chkgbbr nice day day";
    string = remove.gibberish(string) // returns "This is This is a nice day day"
    string = remove.redundant(string) // returns "This is a nice day"
    string = remove.characters(string, 10) // returns "This … day"

### Browser

To use it in browser, simply include the file `remove.js` in your html

    <script src="remove.js"></script>

... and use it like

    var string = "bmgbberish This is This is a chkgbbr nice day day";
    string = remove.gibberish(string) // returns "This is This is a nice day day"
    // and so on.

### jQuery

`remove.js` also works with jQuery. If jQuery is found on the page where you have included the file, then it registers the following custom methods:

- `removeRedundant()` (and its short version `rR()`)
- `removeGibberish()` (and its short version `rG()`)
- `removeCharacters()` (and its short version `rC()`)

All of the methods are chainable (like any other jquery method)

Here's how to convert the above mentioned example into jQuery syntax:

    var strings = $(["bmgbberish This is This is a chkgbbr nice day day"]);
    strings = strings.removeRedundant().removeGibberish().removeCharacters(10);
    // too much typing ? try this:
    strings = strings.rR().rG().rC(10)[0]; // returns "This … day"

## State of the project

The `remove.js` file is around 14 KB, but the minified is only ~4 KB and the gzipped minified is even smaller (1.62 KB).

All the methods are documented inline and a nice docco view can be found here

Certain Limitations:

- The redundant detection logic is not that great. It can be improved a lot.
- The same goes for gibberish detection logic. But in this case, improving it further is really challenging.

*Hacked by Girish Sharma. Taken from Location Bar Enhancer and further enhanced*.

This work is licensed under the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, you can obtain one at http://mozilla.org/MPL/2.0/.