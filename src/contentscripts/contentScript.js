/* DISCLAIMER: Most of the code in this file was not written by me
 * Original version of the code: https://stackoverflow.com/questions/40572679/change-matching-words-in-a-webpages-text-to-buttons/40576258
 *  by stackoverflow user: https://stackoverflow.com/users/3773011/makyen
 *  
 *   The code was adapted to work with the rest of the extension
 */

(findCourses)();

function findCourses() {
    const T_STYLE = "style=\" font-weight:normal;color:#000080;;border: 1px  #000080 double ;letter-spacing:1pt; word-spacing:2pt;font-size:12px;text-align:left;font-family:arial black, sans-serif;line-height:1; \"";

    let counter = 0;
    let highlight = false;

    chrome.storage.local.get({
          illegal: '',
          highlight: false
      }, function (items) {
          let banned = [];
          if (items.illegal !== '') {
              banned = (items.illegal.replace(/\s/g, '')).split(',');
          }

          const websites = ['google', 'youtube'].concat(banned);
          const str = window.location.hostname;
          for (let i in websites) {
              if (str.includes(websites[i])) {
                  return
              }
          }
          highlight = items.highlight;
          execute()
      }
    );


    function delete_space(match) {
        if(match.length === 6) return match;
        return match.substring(0, 3) + match.substring(4);
    }

    function get_style() {
        if (highlight) return T_STYLE;
        return '';
    }

    function replace(match) {
        const code = delete_space(match);
        return `<span ${get_style()} class="corInf ${code}" data-title ="${match}" data-code="${code}">${match.substring(0, 3)}<b></b>${match.substring(3)}</span>`;
    }


    function execute() {
        const match = new RegExp('\\b(?!for)[A-Z][A-Z][A-Z]\\s?[1-4a-d][0-9][0-9]', 'mgi');


        function handleTextNode(textNode) {
            if (textNode.nodeName !== '#text'
              || textNode.parentNode.nodeName === 'SCRIPT'
              || textNode.parentNode.nodeName === 'STYLE'
            ) {
                return;
            }
            let origText = textNode.textContent;
            match.lastIndex = 0;
            let newHtml = origText.replace(match, replace);


            if (newHtml !== origText) {
                counter++;
                let newSpan = document.createElement('span');
                newSpan.innerHTML = newHtml;
                newSpan.node;
                textNode.parentNode.replaceChild(newSpan, textNode);
            }
        }


        let textNodes = [];
        let nodeIter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
        let currentNode;

        while (currentNode = nodeIter.nextNode()) {
            textNodes.push(currentNode);
        }

        textNodes.forEach(function (el) {
            handleTextNode(el);
        });

    }

}