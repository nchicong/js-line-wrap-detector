(function() {
  var nodeNamesToExlude = ["CODE", "EM"];

  var wrapWords = function(text, before, after, join) {
    var join = join || '';
    var words = text.split('');
    for(var i=0;i<words.length;i++) {
      words[i] = before + words[i] + after;
    }
    return words.join(join);
  };

  var wrapWordsInChildElement = function(el) {
    if (el.parentElement.classList.contains("js-detect-wrap")
        || nodeNamesToExlude.indexOf(el.parentElement.nodeName) > -1) {
      return;
    }

    if(el.nodeName != '#text') {
      if(el.innerText){
        el.innerHTML = wrapWords(el.innerText,'<span class="js-detect-wrap">','</span>');
      }
      return;
    }

    var words = el.textContent.replace(/\n/g, " ").split(' ');

    for (var i=0;i<words.length;i++) {
      var word = words[i];

      for (var j=0; j < word.length; j++) {
        var customClass = "";
        if (word.length > 3  && j > word.length/2) {
          customClass = " lighter";
        } else {
          customClass = " darker";
        }

        if (word[j].length <= 0) {
          continue;
        }

        var span = document.createElement('span');
        span.className = "js-detect-wrap" + customClass;

        span.innerText = word[j];
        el.parentNode.insertBefore(span, el);
      }

      var span = document.createElement('span');
      span.className = "js-detect-wrap"
      span.innerText = " ";
      el.parentNode.insertBefore(span, el);
    };
    el.parentNode.removeChild(el);
  };

  var wrapWordsInElement = function(el) {
    if(!el.firstChild) {
      wrapWordsInChildElement(el);
    }
    else {
      var siblings = [];
      var s = el.firstChild;
      do {
        siblings.push(s);
      }
      while(s = s.nextSibling);

      for(var i=0;i<siblings.length;i++) {
        wrapWordsInElement(siblings[i]);
      }
    };
  }

  var getLines = function(el) {

    wrapWordsInElement(el);

    var spans = el.getElementsByClassName('js-detect-wrap');

    var lastOffset = 0, line=[], lines = [], l=0;
    for(var i=0;i<spans.length;i++) {

      var offset = spans[i].offsetTop+spans[i].getBoundingClientRect().height;
      if(offset == lastOffset) {
        line.push(spans[i]);
      }
      else {
        if(line.length > 0) lines[l++] = line;

        line = [spans[i]];
      }
      lastOffset = offset;
    }
    lines.push(line);
    return lines;
  }

  var detector = {
      wrapWords: wrapWords
    , wrapWordsInElement: wrapWordsInElement
    , wrapWordsInChildElement: wrapWordsInChildElement
    , getLines: getLines
  };

  if(typeof define == 'function') {
    define(function() {
      return detector;
    });
  }
  else {
    window.lineWrapDetector = detector;
  }

})();

